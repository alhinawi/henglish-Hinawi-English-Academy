// Render common educational arrows as text, not raw TeX. Code stays verbatim.
const arrows: Record<string,string> = {
  rightarrow: '→', to: '→', Rightarrow: '⇒', longrightarrow: '⟶',
  leftarrow: '←', Leftarrow: '⇐', longleftarrow: '⟵',
  leftrightarrow: '↔', Leftrightarrow: '⇔',
};
export function renderInlineArrows(text: string): string {
  const command = String.raw`\\(longrightarrow|longleftarrow|leftrightarrow|Leftrightarrow|rightarrow|Rightarrow|leftarrow|Leftarrow|to)\b`;
  return text
    .replace(new RegExp(String.raw`\$\s*${command}\s*\$`, 'g'), (_, key: string) => arrows[key])
    .replace(new RegExp(String.raw`\\\(\s*${command}\s*\\\)`, 'g'), (_, key: string) => arrows[key])
    .replace(new RegExp(command, 'g'), (_, key: string) => arrows[key]);
}
