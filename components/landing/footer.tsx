'use client';

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
  Product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Enhance', href: '/enhance' },
    { name: 'Compare-LLM', href: '/compare-llm' },
    { name: 'Library', href: '/prompt-library' },
    { name: 'Scoring', href: '/prompt-scoring' },
  ],
  // Developers: [
  //   { name: "Documentation", href: "#developers" },
  //   { name: "Agent SDK", href: "#" },
  //   { name: "API Reference", href: "#developers" },
  //   { name: "Status", href: "#" },
  // ],
  // Company: [
  //   { name: "About", href: "#" },
  //   { name: "Blog", href: "#" },
  //   { name: "Careers", href: "#", badge: "Hiring" },
  //   { name: "Contact", href: "#" },
  // ],
  Legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Security', href: '#security' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: 'https://x.com/AdiTrivedi17' },
  { name: 'GitHub', href: 'https://github.com/Yuvadi29' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/adityat1702/' },
];

export default function Footer() {
  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <Image
          src="/images/footer.png"
          alt="Bioluminescent landscape"
          className="w-full h-full object-cover object-center"
          width={1000}
          height={1000}
        />
        {/* Gradient fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-white">PromptOS</span>
              </a>

              <p className="text-white/50 leading-relaxed mb-8 max-w-xs text-sm">
                The intelligent operating system for your AI prompts. Orchestrate, optimize, and
                deploy
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-white mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                        {/* {"badge" in link && link.badge && (
                          <span className="text-xs px-2 py-0.5 bg-white text-black rounded-full">
                            {link.badge}
                          </span>
                        )} */}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">&copy; 2026 PromptOS. All rights reserved.</p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
