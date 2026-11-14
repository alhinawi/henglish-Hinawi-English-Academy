import type { Metadata, Viewport } from 'next';
import './globals.built.css';

export const metadata: Metadata = {
  title: 'Henglish Academy | منصة هناوي لتعلم وإتقان اللغة الإنجليزية',
  description:
    'منصة هناوي الأكاديمية الشاملة لتعلم وإتقان اللغة الإنجليزية: أكاديمية الجرامر، كورس المستقبل التام، محاكي المواقف الحقيقية 3D، المعلم الذكي AI، وتحديد مستوى CEFR.',
  keywords:
    'تعلم الانجليزية, جرامر, قواعد اللغة الانجليزية, Future Perfect, CEFR, توفل, ايلتس, محادثة انجليزي, هناوي',
  authors: [{ name: 'Henglish Academy' }],
  icons: { icon: '/logo-clean.png' },
  openGraph: {
    type: 'website',
    url: 'https://henglish.academy',
    title: 'Henglish Academy | منصة هناوي لتعلم وإتقان اللغة الإنجليزية',
    description:
      'المنصة الأكاديمية الشاملة لتعلم قواعد اللغة الإنجليزية، المستقبل التام، محاكي المواقف الحقيقية 3D، والمعلم الذكي AI.',
    images: ['/hinawi-logo-clean.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henglish Academy | منصة هناوي لتعلم وإتقان اللغة الإنجليزية',
    description:
      'المنصة الأكاديمية التفاعلية لتعلم الإنجليزية بذكاء وعمق وفق الإطار الأوروبي CEFR.',
    images: ['/hinawi-logo-clean.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0c0b20',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0b20] text-[#f7f5ff] font-['Cairo',sans-serif] antialiased selection:bg-[#ff4f9a]/30 selection:text-[#ffd166] min-h-screen overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
