import React from 'react';
import { PageRoute } from '../types';
import { BookOpen, Headphones, Mic, PenTool, Languages, Gamepad2, Film, Globe, ArrowLeft, GraduationCap, Volume2, Compass } from 'lucide-react';
import { ALL_GRAMMAR_RULES } from '../data/allGrammarRules';
const AREAS=[
  {title:'كلمات تعيش معاك',desc:'معنى ونطق ومثال. اتعلم الكلمة في سياقها، مش لوحدها.',route:'vocabulary',Icon:Languages},
  {title:'قواعد تفهمها وتستخدمها',desc:'شرح بالمصري وأمثلة وتدريب، من الأساسيات للتراكيب المتقدمة.',route:'grammar',Icon:GraduationCap},
  {title:'ودنك تتعود',desc:'اسمع الإنجليزي وتدرّب على فهم التفاصيل والمعنى.',route:'listening',Icon:Headphones},
  {title:'اتكلم بثقة',desc:'حوارات وتدريبات تساعدك ترتب كلامك وتعبّر عن نفسك.',route:'speaking',Icon:Mic},
  {title:'اقرأ وافهم',desc:'نصوص وأسئلة فهم توسع حصيلتك وتخليك تلتقط المعنى.',route:'reading',Icon:BookOpen},
  {title:'اكتب فكرتك',desc:'ممارسة الكتابة من الجملة للرسالة والمقال.',route:'writing',Icon:PenTool},
  {title:'نطق أوضح',desc:'اتعرف على الأصوات والفروق بينها واتمرن عليها.',route:'pronunciation',Icon:Volume2},
  {title:'اتعلم من الأفلام',desc:'اسمع الحوار في المشهد وافهمه ودرّب نفسك عليه.',route:'movies',Icon:Film},
  {title:'العب واتعلم',desc:'تحديات كلمات وجمل وذاكرة، وكل جولة فرصة تراجع.',route:'games',Icon:Gamepad2},
  {title:'مواقف حقيقية',desc:'جرّب تستخدم الإنجليزي في تفاصيل يومك وسفرك وشغلك.',route:'real-life',Icon:Compass},
  {title:'استكشف العالم',desc:'اتنقل في بيئة ثلاثية الأبعاد وجرب المواقف باللغة.',route:'world-3d',Icon:Globe},
  {title:'اعرف مستواك',desc:'اختبارات وتحديد مستوى يساعدوك تختار خطوتك الجاية.',route:'exams',Icon:GraduationCap},
] as const;
export const HomePage:React.FC<{onNavigate:(route:PageRoute,lessonId?:string)=>void;completionPercentage:number}>=({onNavigate})=><div dir="rtl" className="space-y-10 pb-8">
  <section className="rounded-3xl border border-[#41e7ff]/25 bg-gradient-to-bl from-[#27203f] via-[#171632] to-[#0c0b20] p-6 sm:p-12 space-y-5"><p dir="ltr" className="text-xs tracking-widest text-[#c4ff55]">HENGLISH ACADEMY</p><h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">الإنجليزي كله.<br/><span className="text-[#ffd166]">بطريقتك، وعلى مهلك.</span></h1><p className="max-w-2xl text-base leading-8 text-[#c5c0db]">من أول كلمة لأول محادثة، ومن فهم اللي بتسمعه لكتابة اللي في بالك. هناوي إنجلش منصة شاملة تجمع المهارات والتدريب والمتعة في مكان واحد، بشرح يقربهولك بالمصري.</p><div className="flex flex-wrap gap-3"><button onClick={()=>onNavigate('courses')} className="rounded-2xl bg-[#c4ff55] px-5 py-3 font-black text-[#0c0b20] flex items-center gap-2">اختار بداية رحلتك<ArrowLeft className="w-4 h-4"/></button><button onClick={()=>onNavigate('exams')} className="rounded-2xl border border-white/20 px-5 py-3 font-bold text-white">حدد مستواك</button></div><p className="text-xs text-[#9b7bff]">Learn it. Use it. Own it.</p></section>
  <section><h2 className="text-2xl font-black text-white mb-5">كل مهارة ليها مكان</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{AREAS.map(({title,desc,route,Icon})=><button key={route} onClick={()=>onNavigate(route)} className="rounded-3xl border border-white/10 bg-[#121124] p-5 text-right space-y-3 hover:border-[#41e7ff]/40"><Icon className="w-7 h-7 text-[#41e7ff]"/><h3 className="text-lg font-black text-white">{title}</h3><p className="text-sm leading-7 text-[#b9b6d5]">{desc}</p></button>)}</div></section>
  <section className="rounded-3xl border border-white/10 p-5 space-y-4"><h2 className="text-xl font-black text-white">من دروس الجرامر</h2><p className="text-sm text-[#b9b6d5]">اختيارات من أبواب مختلفة. كل قاعدة جزء من رحلة اللغة، مش الرحلة كلها.</p><div className="grid sm:grid-cols-3 gap-3">{['present-simple','past-simple','first-conditional'].map(id=>ALL_GRAMMAR_RULES.find(r=>r.id===id)).filter(Boolean).map(r=><button key={r!.id} onClick={()=>onNavigate('grammar-lesson',r!.id)} className="rounded-2xl bg-white/5 p-4 text-right space-y-2"><p className="text-xs text-[#9b7bff]">{r!.level}</p><h3 className="font-bold text-white">{r!.titleAr}</h3><p dir="ltr" className="text-xs text-[#b9b6d5]">{r!.titleEn}</p></button>)}</div></section>
</div>;
