import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import { Providers } from '@/lib/providers';
import { Toaster } from 'sonner';
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
//   display: 'swap',
// });

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

// app/layout.tsx
export const metadata = {
  title: 'PromptOS – Your AI Prompt Companion',
  description:
    'Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.',
  openGraph: {
    title: 'PromptOS – Your AI Prompt Companion',
    description:
      'Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.',
    url: 'https://promptos.in/',
    siteName: 'PromptOS',
    images: [
      {
        url: 'https://promptos.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PromptOS Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptOS – Your AI Prompt Companion',
    description:
      'Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.',
    images: ['https://promptos.in/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" prefix="og: https://promptos.in/og-image.png">
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="PromptOS" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://promptos.in/" />
        <link rel="icon" href="/og-image.ico" sizes="any" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PromptOS",
              "url": "https://promptos.in/",
              "logo": "https://promptos.in/og-image.png"
            }
          `}
        </script>
      </head>
      {/* <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} antialiased font-sans`} suppressHydrationWarning> */}
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
