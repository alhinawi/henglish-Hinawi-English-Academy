// ==============================================================================
// HENGLISH ACADEMY - LOCAL EDUCATIONAL BRAIN PROVIDER
// High-fidelity pedagogical fallback engine powered by Henglish syllabus & banks
// ==============================================================================

import { BaseAiProvider } from './baseProvider';
import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export class LocalBrainProvider extends BaseAiProvider {
  readonly name: AiProviderName = 'local';
  readonly supportsStreaming = true;

  isConfigured(): boolean {
    return true; // Always available
  }

  getRecommendedModel(_task: AiTaskType): string {
    return 'henglisheducational-brain-v2';
  }

  async complete(options: AiCompletionOptions): Promise<AiCompletionResult> {
    const startTime = Date.now();
    const lastMsg = options.messages[options.messages.length - 1]?.content || '';
    const q = lastMsg.toLowerCase();

    let text = '';

    // Task-specific high fidelity generation
    if (options.task === 'question_generation') {
      text = JSON.stringify([
        {
          id: `local-q-${Date.now()}-1`,
          type: 'multiple-choice',
          cefrLevel: 'B2',
          topic: 'future-perfect',
          prompt: 'By this time next Friday, our research team _______ the complete AI infrastructure.',
          options: ['will have deployed', 'will deploy', 'has deployed', 'is deploying'],
          correctAnswerIndex: 0,
          explanationAr: 'نستخدم زمن المستقبل التام (will have + V3) مع By + نقطة زمنية مستقبلية للدلالة على اكتمال الحدث قبل حلول ذلك الموعد.',
          distractorNotesAr: [
            'will deploy: مستقبل بسيط لا يعبر عن اكتمال الفعل قبل موعد محدد',
            'has deployed: مضارع تام يعبر عن حدث ماضٍ متصل بالحاضر',
            'is deploying: مضارع مستمر يعبر عن ترتيب زمني قريب',
          ],
          difficulty: 'medium',
          skillCategory: 'grammar',
        },
        {
          id: `local-q-${Date.now()}-2`,
          type: 'multiple-choice',
          cefrLevel: 'B1',
          topic: 'conditionals',
          prompt: 'If you _______ English consistently every morning, you will notice rapid fluency growth.',
          options: ['practice', 'will practice', 'practiced', 'had practiced'],
          correctAnswerIndex: 0,
          explanationAr: 'في الحالة الشرطية الأولى (First Conditional) جملة If تتبع بالمضارع البسيط للتعبير عن أحداث ممكنة في المستقبل.',
          distractorNotesAr: [
            'will practice: خطأ قواعدي، لا نضع will في جملة الشرط بعد If مباشرة',
            'practiced: ماضي بسيط خاص بالحالة الثانية للتخيل',
            'had practiced: ماضي تام خاص بالحالة الثالثة المستحيلة',
          ],
          difficulty: 'easy',
          skillCategory: 'grammar',
        },
      ]);
    } else if (q.includes('future perfect') || q.includes('المستقبل التام') || q.includes('إمتى بستخدم')) {
      text = `### 🦅 شرح زمن المستقبل التام (Future Perfect Tense)

**التركيب الذهبي (Golden Formula):**
> \`Subject + will have + V3 (Past Participle)\`

**إزاي تفكر فيها بالمصري؟**
تخيل نفسك واقف عند نقطة مستقبلية (ديدلاين محدد) وبتبص لورا، وتشوف إن الحدث هيكون **اكتمل وانتهى تماماً** قبل اللحظة دي!

📌 **أمثلة واقعية:**
• *By next October, our team will have built the complete platform.*
(بحلول أكتوبر القادم، سنكون قد أتممنا بناء المنصة بالكامل).
• *By 9 PM tonight, Sarah will have finished all her IELTS assignments.*

⚠️ **أشهر فخ (Common Trap):**
بعد الروابط الزمنية مثل *By the time* أو *When*، استخدم **مضارع بسيط** مش will:
❌ *By the time dad will arrive...*
✅ *By the time dad **arrives**, I will have cooked dinner.*

🔗 **الدرس المعتمد في الأكاديمية:**
تفضل بزيارة الدرس لمشاهدة المخطط الزمني وفيديوهات الشرح: [#courses/grammar/future-perfect](#courses/grammar/future-perfect)

📝 **سؤال سريع:**
*By 2030, scientists _______ a cure for many diseases.*
1. will discover
2. will have discovered
3. have discovered`;
    } else {
      text = `أهلاً بك يا بطل في أكاديمية Henglish! 🦅
يسعدني مساعدتك في تطوير مهاراتك في اللغة الإنجليزية، سواء في شرح القواعد بالأمثلة الواقعية، أو إتقان المفردات مع النطق الصوتي الدقيق، أو تصحيح كتابتك.

أخبرني: ما الموضوع أو التحدي اللغوي الذي تود أن نعمل عليه سوياً الآن؟`;
    }

    return {
      text,
      provider: 'local',
      model: this.getRecommendedModel(options.task),
      durationMs: Date.now() - startTime,
      fallbackChain: ['local'],
      isLocalFallback: true,
    };
  }
}
