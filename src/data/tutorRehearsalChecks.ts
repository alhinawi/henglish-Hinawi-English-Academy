// Optional manual checks for private rehearsal, not promised AI feedback.
export const TUTOR_REHEARSAL_CHECKS:Record<string,readonly string[]>={
 'grammar-teacher':['I chose one grammar pattern to practise.','I wrote an example and marked the part I want to check.'],
 'conversation-partner':['My reply connects to the situation I chose.','I added a detail or a follow-up question to keep the conversation going.'],
 'vocabulary-coach':['I used a word or expression from my practice goal.','My sentence gives enough context to show what I mean.'],
 'writing-assistant':['My draft has a clear purpose and main point.','I included the details the reader needs to understand or respond.'],
 'pronunciation-coach':['I chose a word, sound or stressed syllable to practise aloud.','I marked where I want to pause or stress a word in my rehearsal.'],
 'exam-trainer':['My rehearsal answers the practice question I chose.','I included a reason, example or supporting detail where the task needs one.'],
 'interview-coach':['My rehearsal connects my chosen example to the imaginary role.','I described my own action and a result without adding private details.'],
};
