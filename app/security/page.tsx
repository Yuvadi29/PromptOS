'use client';

import { Navbar } from '@/components/landing/navbar';
import { FooterSection as Footer } from '@/components/landing/footer';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Page Header */}
          <div className="border-b border-border pb-8 mb-12">
            <div className="flex items-center gap-3 text-primary mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-mono text-sm tracking-wider uppercase">
                Security & Integrity
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Security Overview</h1>
            <p className="text-muted-foreground text-sm">Last updated: July 12, 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                1. Architecture and Data Flow
              </h2>
              <p>
                PromptOS is built on a modern, decoupled architecture designed to keep prompt data
                secure, segregated, and accessible.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Encryption in Transit:</strong> All communication between the user&apos;s
                  browser, the PromptOS web servers, and third-party APIs (Supabase, OpenAI,
                  OpenRouter, Google Gemini) is encrypted using TLS 1.3.
                </li>
                <li>
                  <strong>Encryption at Rest:</strong> Prompt data, version logs, and dashboard
                  metrics are persisted in our Supabase PostgreSQL database, utilizing AES-256
                  block-level storage encryption.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                2. Database Segregation and Row-Level Security
              </h2>
              <p>
                To prevent cross-tenant data leaks and unauthorized prompts inspection, we enforce
                strict
                <strong> Row-Level Security (RLS)</strong> policies on our databases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Every prompt insertion, modification, and query is scoped strictly to the
                  authenticated user ID.
                </li>
                <li>
                  Anonymous access is rejected across all operational endpoints; prompt evaluation
                  tables require a cryptographic session token generated via NextAuth.
                </li>
                <li>
                  Administrative and aggregation workers run under isolated service roles with zero
                  exposure of global credentials to frontend clients.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. AI Subprocessor Security</h2>
              <p>
                When you enhance or score a prompt, we transmit relevant data securely to Google
                Generative AI (Gemini) or OpenRouter APIs.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>No Model Training:</strong> PromptOS uses paid developer API endpoints.
                  Under the model providers&apos; commercial terms of service, developer inputs sent
                  to APIs are not used to train or refine public generative models.
                </li>
                <li>
                  <strong>Secure API Key Management:</strong> All API keys (e.g. OpenRouter API key,
                  Supabase keys) are stored as encrypted environment variables on our hosting
                  platform and are accessed exclusively through server-side server actions or API
                  endpoints. No API keys are ever sent or exposed to the client side.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Vulnerability Disclosure</h2>
              <p>
                We believe in proactive security and continuous improvement. If you discover a
                vulnerability or security concern within the PromptOS application code or
                infrastructure, please contact us directly at promptos001@gmail.com rather than
                publishing it. We will work to investigate and resolve all issues promptly.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
