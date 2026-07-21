import './globals.css';
import { Providers } from '@/lib/providers';
import { Toaster } from 'sonner';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistPixelLine } from 'geist/font/pixel';
import ClientShell from '@/components/ui/client-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang="en"
      prefix="og: https://promptos.in/og-image.png"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="author" content="PromptOS" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content="93fdV_bSyn6_AEFyCdFBmH3SrwQhjRh9rrZ9CLY2JOk" />
        <link rel="canonical" href="https://promptos.in/" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${GeistPixelLine.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ClientShell>
          <Providers session={session}>
            <Toaster position="top-right" richColors />
            {children}
            <Analytics />
            <SpeedInsights />
          </Providers>
        </ClientShell>
      </body>
    </html>
  );
}
