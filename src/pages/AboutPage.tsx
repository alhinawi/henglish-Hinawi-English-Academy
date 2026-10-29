import React from 'react';
import { Logo } from '../components/Logo';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Brand Hero */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Logo size="xl" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          عن منصة هناوي إنجلش الأكاديمية 🦅
        </h1>

        <p className="text-base sm:text-lg text-[#dedbf4] max-w-2xl mx-auto leading-relaxed">
          فلسفتنا بسيطة وعميقة في نفس الوقت: <span className="text-[#ffd166] font-bold">"Learn it. Use it. Own it."</span> — لا تكتفِ بحفظ القواعد للامتحان، بل افهم منطقها لتمتلك لغة إنجليزية طبيعية وواثقة مدى الحياة.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center space-y-3">
          <span className="w-12 h-12 rounded-2xl bg-[#ffd166]/15 text-[#ffd166] flex items-center justify-center text-xl mx-auto font-black">
            01
          </span>
          <h3 className="text-lg font-black text-white">LEARN IT (افهمها)</h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
            الشرح باللهجة المصرية البسيطة التي تقرب المعنى لذهنك دون أي تعقيد أكاديمي جاف.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center space-y-3">
          <span className="w-12 h-12 rounded-2xl bg-[#41e7ff]/15 text-[#41e7ff] flex items-center justify-center text-xl mx-auto font-black">
            02
          </span>
          <h3 className="text-lg font-black text-white">USE IT (طبّقها)</h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
            التمارين التفاعلية، ألعاب تركيب الجمل، وبنوك الأسئلة المباشرة التي تجعلك تطبق فوراً.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 text-center space-y-3">
          <span className="w-12 h-12 rounded-2xl bg-[#c4ff55]/15 text-[#c4ff55] flex items-center justify-center text-xl mx-auto font-black">
            03
          </span>
          <h3 className="text-lg font-black text-white">OWN IT (امتلكها)</h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
            النطق الصوتي، والمحادثات الواقعية في بيئة العمل والمطارات والمقابلات الشخصية.
          </p>
        </div>
      </div>

      {/* The Story & Methodology */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ffd166]" />
          <span>لماذا صممنا هذه التجربة التعليمية؟</span>
        </h2>

        <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
          لاحظنا على مدار سنوات تدريس اللغة الإنجليزية أن الكثير من الطلاب يحفظون الأزمنة المعقدة مثل <span className="en font-bold text-[#41e7ff]">Future Perfect</span> كمعادلة صماء (will + have + V3)، لكن بمجرد أن يُطلب منهم التحدث أو كتابة إيميل رسمي يتلعثمون ويقعون في فخاخ مثل <span className="en text-[#ff4f9a]">will has</span> أو التكرار الخاطئ لـ <span className="en text-[#ff4f9a]">will</span> في جملة <span className="en text-[#41e7ff]">by the time</span>.
        </p>

        <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
          لذلك، قررنا بناء هذه المنصة المتكاملة: تصميم بصري داكن ونيوني مريح للعين، نطق صوتي حقيقي يساعد أذنيك على الاستيعاب، ألعاب تفاعلية، ولوحة متابعة شخصية تحفزك على المداومة دون ملل.
        </p>

        <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-[#c4ff55] font-bold">
          <ShieldCheck className="w-5 h-5" />
          <span>منصة تعليمية مطورة بالكامل لخدمة الطالب العربي والعالمي.</span>
        </div>
      </div>

    </div>
  );
};
