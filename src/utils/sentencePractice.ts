// Use identical tokens for word-bank generation and answer comparison.
export function sentencePracticeWords(text: string): string[] {
  return text.replace(/[.,!?;:]/g, '').trim().split(/\s+/).filter(Boolean);
}

export function isSentencePracticeCorrect(answer: string[], target: string): boolean {
  return answer.join(' ').toLowerCase() === sentencePracticeWords(target).join(' ').toLowerCase();
}
