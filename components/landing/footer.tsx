'use client';

import { Github, Twitter } from 'lucide-react';
import { Logo } from '../Logo';

const footerLinks = {
  Product: [
    { name: 'Features', href: '#features' },
    { name: 'Technology', href: '#how-it-works' },
    { name: 'Metrics', href: '#metrics' },
    { name: 'Changelog', href: 'https://github.com/Yuvadi29/PromptOS/releases' },
  ],
  Developers: [
    // { name: 'Documentation', href: '#' },
    // { name: 'API Reference', href: '#' },
    // { name: 'SDK', href: '#developers' },
    { name: 'Status', href: '/status' },
  ],
  Legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
  ],
};

export function FooterSection() {
  return (
    <footer className="relative border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="#" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/5 border border-white/10 flex items-center justify-center">
                  <Logo className="w-5 h-5" />
                </div>
                <span className="font-semibold text-lg tracking-tight text-white">PromptOS</span>
              </a>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                The intelligent operating system for your AI prompts. Enhance, compare, and deploy.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://x.com/AdiTrivedi17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://github.com/Yuvadi29/PromptOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PromptOS. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
