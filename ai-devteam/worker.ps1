[CmdletBinding()]
param([int]$PollSeconds = 15)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Agy = Join-Path $env:LOCALAPPDATA 'agy\bin\agy.exe'
$QueueRoot = Join-Path $Root 'queue'
$Queues = @{
    Pending = Join-Path $QueueRoot 'pending'; Running = Join-Path $QueueRoot 'running'
    Done = Join-Path $QueueRoot 'done'; Failed = Join-Path $QueueRoot 'failed'
    Blocked = Join-Path $QueueRoot 'blocked'; NeedsReview = Join-Path $QueueRoot 'needs_review'
}
$Logs = Join-Path $Root 'logs'
$Reviewer = Join-Path $Root 'autopilot-reviewer.ps1'

function Write-WorkerLog {
    param([Parameter(Mandatory)][string]$Path, [Parameter(Mandatory)][string]$Message)
    Add-Content -LiteralPath $Path -Value $Message -Encoding UTF8
}

function Quote-WindowsArgument {
    param([Parameter(Mandatory)][string]$Value)
    if ($Value -notmatch '[\s"]') { return $Value }
    '"' + (($Value -replace '(\\*)"', '$1$1\\"') -replace '(\\*)$', '$1$1') + '"'
}

function Invoke-Agy {
    param(
        [Parameter(Mandatory)][string]$Prompt,
        [Parameter(Mandatory)][string]$Workspace
    )

    if (-not (Test-Path -LiteralPath $Workspace -PathType Container)) {
        throw "Autopilot workspace does not exist: $Workspace"
    }
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = $Agy
    $startInfo.Arguments = '--new-project --add-dir ' + (Quote-WindowsArgument $Workspace) +
        ' --dangerously-skip-permissions --effort high --print-timeout 20m --print ' + (Quote-WindowsArgument $Prompt)
    $startInfo.UseShellExecute = $false; $startInfo.CreateNoWindow = $true
    $startInfo.RedirectStandardOutput = $true; $startInfo.RedirectStandardError = $true
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo
    if (-not $process.Start()) { throw 'Unable to start Antigravity CLI.' }
    $stdoutTask = $process.StandardOutput.ReadToEndAsync()
    $stderrTask = $process.StandardError.ReadToEndAsync()
    if (-not $process.WaitForExit(1200000)) {
        $process.Kill()
        throw 'Antigravity exceeded the 20-minute task limit and was stopped.'
    }
    [pscustomobject]@{
        ExitCode = $process.ExitCode
        StdOut = $stdoutTask.GetAwaiter().GetResult()
        StdErr = $stderrTask.GetAwaiter().GetResult()
    }
}

function Move-TaskFile {
    param([Parameter(Mandatory)][string]$Source, [Parameter(Mandatory)][string]$DestinationDirectory)
    $destination = Join-Path $DestinationDirectory (Split-Path -Leaf $Source)
    if (Test-Path -LiteralPath $destination) { throw "Refusing to overwrite existing task file: $destination" }
    Move-Item -LiteralPath $Source -Destination $destination -ErrorAction Stop
    $destination
}

foreach ($directory in @($Queues.Values) + $Logs) { New-Item -ItemType Directory -Path $directory -Force | Out-Null }
if (-not (Test-Path -LiteralPath $Agy -PathType Leaf)) { throw "Antigravity CLI not found: $Agy" }
if (-not (Test-Path -LiteralPath $Reviewer -PathType Leaf)) { throw "Autopilot reviewer not found: $Reviewer" }

$mutex = New-Object System.Threading.Mutex($false, 'Global\HenglishAIDevTeamWorker')
$ownsMutex = $false
try {
    try { $ownsMutex = $mutex.WaitOne(0) }
    catch [System.Threading.AbandonedMutexException] { $ownsMutex = $true; Write-Output 'Recovered an abandoned Henglish AI DevTeam worker mutex.' }
    if (-not $ownsMutex) { Write-Output 'Another Henglish AI DevTeam worker is already running; exiting.'; exit 0 }
    Write-Output "Henglish AI DevTeam worker started at $(Get-Date -Format o)."

    while ($true) {
        & powershell.exe -NoProfile -File $Reviewer -Once
        if ($LASTEXITCODE -ne 0) { throw "Autopilot reviewer failed with exit code $LASTEXITCODE." }
        $tasks = @(Get-ChildItem -LiteralPath $Queues.Pending -Filter '*.json' -File | Sort-Object Name, LastWriteTime)
        if ($tasks.Count -eq 0) { Start-Sleep -Seconds $PollSeconds; continue }
        foreach ($task in $tasks) {
            $runningFile = $null
            $log = Join-Path $Logs ($task.BaseName + '.log')
            try {
                $runningFile = Move-TaskFile -Source $task.FullName -DestinationDirectory $Queues.Running
                Set-Content -LiteralPath $log -Value "Started: $(Get-Date -Format o)" -Encoding UTF8
                $data = Get-Content -LiteralPath $runningFile -Raw -Encoding UTF8 | ConvertFrom-Json
                if ([string]::IsNullOrWhiteSpace([string]$data.prompt)) { throw 'Task prompt is missing.' }
                $workspace = if ($data.workspace) { [string]$data.workspace } else { Split-Path -Parent $Root }
                $result = Invoke-Agy -Prompt ([string]$data.prompt) -Workspace $workspace
                if (-not [string]::IsNullOrWhiteSpace($result.StdOut)) { Write-WorkerLog -Path $log -Message "--- stdout ---`n$($result.StdOut.TrimEnd())" }
                if (-not [string]::IsNullOrWhiteSpace($result.StdErr)) { Write-WorkerLog -Path $log -Message "--- stderr ---`n$($result.StdErr.TrimEnd())" }
                Write-WorkerLog -Path $log -Message "Exit code: $($result.ExitCode)"
                $combinedOutput = "$($result.StdOut)`n$($result.StdErr)"
                $permissionDenied = $combinedOutput -match '(?is)auto[- ]?denied|headless mode cannot prompt|required the\s+["'']?[^\r\n]*permission|permission\s*(?:was\s*)?(?:denied|refused)|not permitted|no output produced'
                if ($permissionDenied) { $destination = $Queues.Blocked; $status = 'BLOCKED: Antigravity permission was auto-denied or could not be requested.' }
                elseif ($result.ExitCode -ne 0) { $destination = $Queues.Failed; $status = "FAILED: Antigravity exited with code $($result.ExitCode)." }
                else { $destination = $Queues.NeedsReview; $status = 'NEEDS_REVIEW: exit code 0 is not evidence that the requested work is complete.' }
                Write-WorkerLog -Path $log -Message "Status: $status"
                Write-WorkerLog -Path $log -Message "Finished: $(Get-Date -Format o)"
                Move-TaskFile -Source $runningFile -DestinationDirectory $destination | Out-Null
                $runningFile = $null
            }
            catch {
                $message = $_ | Out-String
                if (-not (Test-Path -LiteralPath $log)) { Set-Content -LiteralPath $log -Value "Started: $(Get-Date -Format o)" -Encoding UTF8 }
                Write-WorkerLog -Path $log -Message "ERROR: $message"
                Write-WorkerLog -Path $log -Message 'Status: FAILED'
                Write-WorkerLog -Path $log -Message "Finished: $(Get-Date -Format o)"
                if ($runningFile -and (Test-Path -LiteralPath $runningFile)) {
                    try { Move-TaskFile -Source $runningFile -DestinationDirectory $Queues.Failed | Out-Null }
                    catch { Write-WorkerLog -Path $log -Message "ERROR moving task to failed: $($_ | Out-String)" }
                }
            }
        }
    }
}
finally {
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
