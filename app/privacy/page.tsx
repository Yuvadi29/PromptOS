'use client';

import { Navbar } from '@/components/landing/navbar';
import { FooterSection as Footer } from '@/components/landing/footer';
import { Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
              <Eye className="w-5 h-5" />
              <span className="font-mono text-sm tracking-wider uppercase">
                Privacy & Data Handling
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-sm">Last updated: July 12, 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p>
                At PromptOS, your privacy is paramount. This Privacy Policy details how we handle,
                process, and protect your data when you use the PromptOS platform. By using the
                platform, you agree to the practices described here. PromptOS is designed
                specifically for prompt engineers and developers, keeping database integrity and
                security at the forefront.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p>
                We collect only the essential information needed to deliver and optimize our
                services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> If you sign up, we securely store your name,
                  email, and authentication details.
                </li>
                <li>
                  <strong>Prompt Logs & Data:</strong> When you input a prompt for enhancement,
                  comparison, or scoring, we temporarily process and store the prompt text, version
                  history, and associated evaluation scores.
                </li>
                <li>
                  <strong>Usage & Analytics:</strong> We collect system-level metrics (such as
                  prompt creation streaks, latency, and feedback events) to calculate user
                  statistics and show aggregated performance charts.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                3. How We Process and Use Your Information
              </h2>
              <p>We process your data strictly to facilitate the application&apos;s workflows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Prompt Intelligence:</strong> Transforming and enhancing prompts via
                  secure AI endpoints (using the Gemini API and OpenRouter).
                </li>
                <li>
                  <strong>Telemetry & Streaks:</strong> Generating dashboard statistics, tracking
                  prompt scoring criteria, and keeping user-activity streaks active.
                </li>
                <li>
                  <strong>Service Improvements:</strong> Debugging system errors, optimizing API
                  request latencies, and analyzing user feedback to refine prompt templates.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                4. Third-Party Subprocessors
              </h2>
              <p>
                To provide prompt enhancement and database persistence, we coordinate with trusted
                infrastructure and model providers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Generative AI (Gemini):</strong> Used to evaluate, score, and
                  restructure prompts. We utilize their developer API services, which govern data
                  privacy under developer agreements (meaning raw prompts are not used to train
                  public baseline models).
                </li>
                <li>
                  <strong>Supabase:</strong> Our backend database provider, storing prompt
                  libraries, version histories, and statistics with row-level security (RLS)
                  enforcement.
                </li>
                <li>
                  <strong>Vercel & NextAuth:</strong> Powering global hosting, site analytics, and
                  user sessions.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                5. Data Retention & Deletion
              </h2>
              <p>
                You retain complete control of your data. You may delete any saved prompt, prompt
                evaluation, or version from your personal dashboard at any time. When you choose to
                delete your account or specific data points, they are immediately purged from our
                active databases.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
              <p>
                For questions regarding data processing, security, or to request manual account
                deletion, please open an issue on our public GitHub repository or reach out directly
                at promptos001@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
