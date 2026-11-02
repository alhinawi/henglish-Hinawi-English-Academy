[CmdletBinding()]
param(
    [int]$PollSeconds = 20,
    [switch]$Once
)

$ErrorActionPreference = 'Stop'
$Root = $PSScriptRoot
$Worktree = 'C:\Users\hinawi\Desktop\Henglish-ai-autopilot'
$QueueRoot = Join-Path $Root 'queue'
$NeedsReview = Join-Path $QueueRoot 'needs_review'
$Done = Join-Path $QueueRoot 'done'
$Blocked = Join-Path $QueueRoot 'blocked'
$Pending = Join-Path $QueueRoot 'pending'
$Logs = Join-Path $Root 'logs'
$mutex = New-Object System.Threading.Mutex($false, 'Global\HenglishAIDevTeamReviewer')
$ownsMutex = $false

function Write-ReviewLog {
    param([string]$Path, [string]$Message)
    Add-Content -LiteralPath $Path -Value $Message -Encoding UTF8
}

function Move-ReviewTask {
    param([string]$Source, [string]$Directory)
    $target = Join-Path $Directory (Split-Path -Leaf $Source)
    if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite task: $target" }
    Move-Item -LiteralPath $Source -Destination $target -ErrorAction Stop
}

function New-AutopilotTask {
    $id = 'autopilot-cycle-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
    $task = [ordered]@{
        id = $id
        workspace = $Worktree
        prompt = 'You are the Henglish autonomous development cycle. Work only in the supplied workspace and begin by reading AGENTS.md. Inspect the current branch, package scripts, and relevant code. Choose exactly one small, high-value, independently reviewable improvement based on concrete evidence in the code or failing checks; do not invent work merely to stay busy. Implement it completely. Run the narrowest relevant checks and pnpm build. Do not commit, push, open a pull request, deploy, access secrets or environment files, modify .env files, change Vercel or Supabase settings, make database migrations, run database mutations, weaken security, add dependencies, or alter files outside the workspace. If no safe, evidence-based improvement exists, make no changes and explain why. In your final response state the selected goal, evidence, files changed, checks run and results, and remaining risks.'
    }
    $path = Join-Path $Pending ($id + '.json')
    $task | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $path -Encoding UTF8
}

foreach ($directory in @($NeedsReview, $Done, $Blocked, $Pending, $Logs)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}
if (-not (Test-Path -LiteralPath $Worktree -PathType Container)) { throw "Autopilot worktree not found: $Worktree" }

try {
    try { $ownsMutex = $mutex.WaitOne(0) }
    catch [System.Threading.AbandonedMutexException] { $ownsMutex = $true }
    if (-not $ownsMutex) { exit 0 }

    while ($true) {
        $tasks = @(Get-ChildItem -LiteralPath $NeedsReview -Filter 'autopilot-cycle-*.json' -File | Sort-Object LastWriteTime)
        foreach ($task in $tasks) {
            $log = Join-Path $Logs ($task.BaseName + '.review.log')
            Set-Content -LiteralPath $log -Value "Review started: $(Get-Date -Format o)" -Encoding UTF8
            try {
                $status = @(git -C $Worktree status --porcelain)
                if ($status.Count -eq 0) { throw 'No workspace changes were produced; no follow-up task will be created.' }
                $changed = @(git -C $Worktree diff --name-only HEAD; git -C $Worktree ls-files --others --exclude-standard)
                $restricted = @($changed | Where-Object { $_ -match '(^|/)(\.env($|\.)|\.vercel/|supabase/migrations/)|(^|/)(vercel\.json|package\.json|pnpm-lock\.yaml)$' })
                if ($restricted.Count -gt 0) { throw "Restricted paths changed: $($restricted -join ', ')" }
                & git -C $Worktree diff --check
                if ($LASTEXITCODE -ne 0) { throw 'git diff --check failed.' }
                & pnpm --dir $Worktree build *>> $log
                if ($LASTEXITCODE -ne 0) { throw 'pnpm build failed.' }
                & git -C $Worktree add --all
                & git -C $Worktree commit -m "chore(autopilot): verified cycle $($task.BaseName)" *>> $log
                if ($LASTEXITCODE -ne 0) { throw 'Local commit failed.' }
                Write-ReviewLog -Path $log -Message "Review passed: diff check and pnpm build succeeded."
                Move-ReviewTask -Source $task.FullName -Directory $Done
                New-AutopilotTask
                Write-ReviewLog -Path $log -Message "Next cycle queued: $(Get-Date -Format o)"
            }
            catch {
                Write-ReviewLog -Path $log -Message "BLOCKED: $($_ | Out-String)"
                Move-ReviewTask -Source $task.FullName -Directory $Blocked
            }
        }
        if ($Once) { break }
        Start-Sleep -Seconds $PollSeconds
    }
}
finally {
    if ($ownsMutex) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
