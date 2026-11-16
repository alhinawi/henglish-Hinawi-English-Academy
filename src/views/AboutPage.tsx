import React from 'react';
import { Logo } from '../components/Logo';
import { ONLINE_IMAGES } from '../data/imageAssets';
import { Sparkles, ShieldCheck, Users, GraduationCap, Award, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      
      {/* Brand Hero with Real Photography Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 p-8 sm:p-14 text-center space-y-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={ONLINE_IMAGES.learningStudyGroup} 
            alt="Students collaborating at Henglish Academy" 
            className="w-full h-full object-cover filter brightness-[0.2]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0c0b20] via-[#0c0b20]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-center">
            <div className="sm:hidden"><Logo size="sm" /></div><div className="hidden sm:block"><Logo size="xl" /></div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            عن منصة هناوي إنجلش الأكاديمية
          </h1>

          <p className="text-base sm:text-lg text-[#dedbf4] max-w-2xl mx-auto leading-relaxed">
            هناوي إنجلش منصة شاملة للغة كلها: كلمات وقواعد، استماع ومحادثة، قراءة وكتابة ونطق. اتعلم وافهم، وبعدها استخدم اللغة في الأفلام والألعاب والمواقف والعالم ثلاثي الأبعاد، وقيس تقدمك بالاختبارات. <span dir="ltr" className="text-[#ffd166] font-bold inline-block">Learn it. Use it. Own it.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#c4ff55] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              شرح بالمصري
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#41e7ff] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              ممارسة على مهارات مختلفة
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#ffd166] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              كلمات وقواعد ومهارات
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-[#ff4f9a] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              اختبارات ومتابعة تقدم
            </span>
          </div>
        </div>
      </div>

      {/* Visual Photos Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={ONLINE_IMAGES.modernClassroom} 
              alt="Classroom and lectures" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent" />
          </div>
          <div className="p-5 space-y-2">
            <h4 className="font-bold text-white text-base">محاضرات أكاديمية تفاعلية</h4>
            <p className="text-xs text-[#b9b6d5] leading-relaxed">
              أمثلة وصور وحوارات تقربلك المعنى، وتربط الكلمات والقواعد باستخدامها في الحياة.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={ONLINE_IMAGES.mentorStudent} 
              alt="Mentorship and direct guidance" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent" />
          </div>
          <div className="p-5 space-y-2">
            <h4 className="font-bold text-white text-base">إرشاد وتصحيح فوري</h4>
            <p className="text-xs text-[#b9b6d5] leading-relaxed">
              تنبيهات فورية على الفخاخ الشائعة التي يقع فيها الطلاب مع نصائح خاصة باللهجة المصرية.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 group">
          <div className="h-48 overflow-hidden relative">
            <img 
              src={ONLINE_IMAGES.graduationCelebration} 
              alt="Graduation milestones" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent" />
          </div>
          <div className="p-5 space-y-2">
            <h4 className="font-bold text-white text-base">إنجاز حقيقي ونتائج ملموسة</h4>
            <p className="text-xs text-[#b9b6d5] leading-relaxed">
              شهادات إتمام، وشارات تميز، وتقدم محفوظ لحظة بلحظة على متصفحك.
            </p>
          </div>
        </div>
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
          حفظ القاعدة لوحده مش كفاية، وحفظ كلمات من غير سياق مش بيخلي الكلام أسهل. عشان كده بنجمع الفهم والممارسة: تسمع وتقرا، تتكلم وتكتب، وتراجع اللي اتعلمته في مواقف وتحديات متنوعة.
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
