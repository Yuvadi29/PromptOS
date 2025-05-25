import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// app/layout.tsx
export const metadata = {
  title: "PromptOS – Your AI Prompt Companion",
  description: "Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.",
  openGraph: {
    title: "PromptOS – Your AI Prompt Companion",
    description: "Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.",
    url: "https://prompt-os-five.vercel.app",
    siteName: "PromptOS",
    images: [
      {
        url: "https://prompt-os-five.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptOS Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptOS – Your AI Prompt Companion",
    description: "Enhance your prompts, compare LLMs, and streamline your AI workflows with PromptOS.",
    images: ["https://prompt-os-five.vercel.app/og-image.png"],
  },
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
