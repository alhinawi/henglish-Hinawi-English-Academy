const fs=require('fs'),a=require('node:assert/strict'),s=fs.readFileSync('src/components/translation/PracticeModeTab.tsx','utf8');
a(s.includes('space-y-2 rounded-xl border border-white/10 px-2 py-3 sm:px-3'));
a(s.includes('className="text-start text-white leading-8">{answer}</p>'));
a(s.includes("lang={challenge.direction === 'ar-to-en' ? 'en' : 'ar'}"));
a(s.includes("dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'}"));
console.log('Translation model text uses its own language reading edge; mobile horizontal8px,vertical12px/desktop12px retained PASS');
