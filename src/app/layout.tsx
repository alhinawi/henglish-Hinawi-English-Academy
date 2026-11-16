import type { Metadata, Viewport } from 'next';
import './globals.built.css';

export const metadata: Metadata = {
  title: 'Henglish Academy | منصة شاملة لتعلم الإنجليزية',
  description:
    'هناوي إنجلش منصة شاملة لتعلم الإنجليزية: كلمات وقواعد، استماع ومحادثة، قراءة وكتابة ونطق، أفلام وألعاب ومواقف وعالم ثلاثي الأبعاد واختبارات.',
  keywords:
    'تعلم الانجليزية, كلمات, جرامر, استماع, محادثة, قراءة, كتابة, نطق, افلام, العاب, CEFR, هناوي',
  authors: [{ name: 'Henglish Academy' }],
  icons: { icon: '/logo-clean.png' },
  openGraph: {
    type: 'website',
    url: 'https://henglish.academy',
    title: 'Henglish Academy | منصة شاملة لتعلم الإنجليزية',
    description:
      'هناوي إنجلش منصة شاملة لتعلم الإنجليزية: كلمات وقواعد، استماع ومحادثة، قراءة وكتابة ونطق، أفلام وألعاب ومواقف وعالم ثلاثي الأبعاد واختبارات.',
    images: ['/logo-clean.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henglish Academy | منصة شاملة لتعلم الإنجليزية',
    description:
      'المنصة الأكاديمية التفاعلية لتعلم الإنجليزية بذكاء وعمق وفق الإطار الأوروبي CEFR.',
    images: ['/logo-clean.png'],
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0c0b20] text-[#f7f5ff] font-['Cairo',sans-serif] antialiased selection:bg-[#ff4f9a]/30 selection:text-[#ffd166] min-h-screen overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
