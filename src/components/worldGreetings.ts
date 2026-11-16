export interface WorldGreeting { ar: string; en: string; clip?: string }
// Optional clip URLs are reserved for reviewed, self-hosted Egyptian recordings.
// No runtime API key, vendor call or paid TTS request is made from the browser.
export const WORLD_GREETINGS: Record<string, WorldGreeting> = {
  airport: { ar: 'أهلاً بيك في المطار! جواز السفر والتذكرة معاك؟ تعالى نتدرّب على إجراءات السفر بالإنجليزي.', en: 'Welcome to the airport! Do you have your passport and ticket? Let us practise checking in.' },
  restaurant: { ar: 'أهلاً وسهلاً! نوّرت المطعم. تحب تقعد فين؟ تعالى نطلب الأكل بالإنجليزي.', en: 'Welcome to the restaurant! Where would you like to sit? Let us order in English.' },
  hospital: { ar: 'أهلاً بيك، ألف سلامة عليك! قولّي إيه اللي تعبك، ونتعلّم نشرح الأعراض بالإنجليزي.', en: 'Welcome. I hope you feel better soon! Let us learn to describe your symptoms in English.' },
  'tech-office': { ar: 'أهلاً بيك! إحنا مستنيّينك للمقابلة. خد نفس وخلّينا نعرّف نفسنا بالإنجليزي.', en: 'Welcome! We are ready for your interview. Take a breath and let us introduce ourselves in English.' },
  university: { ar: 'أهلاً يا بطل، نوّرت الأكاديمية! أنا هناوي. اختار مكان في المدينة وتعالى نتدرّب على الإنجليزي سوا.', en: 'Welcome to the academy! I am Hinawi. Choose a place in the city and let us practise English together.' },
  clothing: { ar: 'أهلاً وسهلاً، نوّرت محل الهدوم! بتدوّر على مقاس إيه؟ تعالى نتعلّم نسأل عن المقاسات والأسعار بالإنجليزي.', en: 'Welcome to the clothing shop! What size are you looking for? Let us ask about sizes and prices in English.' },
  supermarket: { ar: 'أهلاً بيك في السوبر ماركت! محتاج مساعدة تلاقي حاجة؟ تعالى نسأل عن المنتجات والحساب بالإنجليزي.', en: 'Welcome to the supermarket! Do you need help finding anything? Let us ask about products and the checkout in English.' },
};
let currentAudio: HTMLAudioElement | null = null;
export function stopWorldGreeting() {
  currentAudio?.pause(); currentAudio = null;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
/** Call only from a click/tap/key handler. The requested dialect depends on installed voices. */
export async function playWorldGreeting(id: string): Promise<'clip' | 'browser' | 'unavailable'> {
  stopWorldGreeting();
  const greeting = WORLD_GREETINGS[id];
  if (!greeting) return 'unavailable';
  if (greeting.clip) {
    currentAudio = new Audio(greeting.clip);
    try { await currentAudio.play(); return 'clip'; } catch { /* Retain subtitles and offer the browser fallback. */ }
  }
  if (!('speechSynthesis' in window)) return 'unavailable';
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => /^ar[-_]EG$/i.test(v.lang)) || voices.find(v => /^ar[-_]/i.test(v.lang));
  // Do not silently speak Arabic through an English-only device voice.
  if (!voice) return 'unavailable';
  const utterance = new SpeechSynthesisUtterance(greeting.ar);
  utterance.lang = 'ar-EG'; utterance.voice = voice; utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
  return 'browser';
}
