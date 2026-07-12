'use client';

import { Navbar } from '@/components/landing/navbar';
import { FooterSection as Footer } from '@/components/landing/footer';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
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
              <FileText className="w-5 h-5" />
              <span className="font-mono text-sm tracking-wider uppercase">Rules & Agreements</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-sm">Last updated: July 12, 2026</p>
          </div>

          {/* Content */}
          <div className="space-y-10 text-zinc-300 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using PromptOS, you acknowledge that you have read, understood, and
                agree to be bound by these Terms of Service. If you do not agree to these terms, you
                must immediately discontinue use of the platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
              <p>
                PromptOS provides prompt management, LLM side-by-side comparison, scoring analytics,
                and auto-enhancement utilities leveraging large language models. The service is
                provided &quot;as-is&quot; and &quot;as available&quot; to support developers and
                engineers building with AI models. We reserve the right to modify, suspend, or
                discontinue service features at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. User Data Ownership</h2>
              <p>
                <strong>You retain all ownership rights</strong> to any prompts, configurations,
                instructions, or inputs you submit to PromptOS. We do not claim any proprietary
                rights over your prompts. By submitting prompts to our service, you grant PromptOS a
                worldwide, royalty-free license to store, retrieve, format, and transmit the prompts
                solely as necessary to provide the enhancement, scoring, and comparison tools to
                you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Prohibited Activities</h2>
              <p>
                When using PromptOS, you agree not to submit or attempt to process prompts that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any local, national, or international laws or regulations.</li>
                <li>
                  Contain harmful, harassing, abusive, or explicitly dangerous instructions designed
                  to trigger model jailbreaks or generate harmful content.
                </li>
                <li>
                  Involve prompt injection attacks or malicious payloads targeting our database or
                  core AI processing backend.
                </li>
                <li>
                  Attempt to bypass authentication structures, scrape data from other users, or
                  overload platform APIs.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                5. Intellectual Property & Brand
              </h2>
              <p>
                All PromptOS software, code, styling, design assets, and logos are the property of
                Aditya Trivedi and PromptOS contributors. This repository is hosted publicly for
                demonstration and contribution purposes, but all commercial rights and trademarks
                are reserved. Redistribution, hosting, or resale of PromptOS as a service is
                prohibited without explicit prior consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>
                PromptOS and its creators are not liable for any direct, indirect, incidental, or
                consequential damages resulting from your use of the service. Because AI
                enhancements and scoring systems are probabilistic in nature, we do not guarantee
                the correctness, safety, or deployment readiness of prompt recommendations.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
