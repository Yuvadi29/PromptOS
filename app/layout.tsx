import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



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
