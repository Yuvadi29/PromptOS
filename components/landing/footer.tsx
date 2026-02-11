'use client';

import Link from 'next/link';
import { Github, Linkedin, Youtube, Layers } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative border-t border-white/[0.06] bg-zinc-950 pt-20 pb-10">
            <div className="container px-6 md:px-8 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">
                                PromptOS
                            </span>
                        </div>
                        <p className="text-zinc-500 max-w-xs mb-8 leading-relaxed text-sm">
                            The intelligent operating system for your AI prompts. Orchestrate, optimize, and deploy.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Github, href: "https://github.com/Yuvadi29/PromptOS/" },
                                { icon: Youtube, href: "https://www.youtube.com/@Coding_Adda" },
                                { icon: Linkedin, href: "https://www.linkedin.com/in/adityat1702/" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/[0.08] flex items-center justify-center text-zinc-500 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/30 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-semibold text-white mb-5 text-sm">Product</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Enhance", href: "/enhance" },
                                { label: "Library", href: "/prompt-library" },
                                { label: "Scoring", href: "/prompt-scoring" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-semibold text-white mb-5 text-sm">Resources</h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Documentation", href: "/docs" },
                                { label: "Changelog", href: "https://github.com/Yuvadi29/PromptOS/releases" },
                                { label: "Support", href: "mailto:letstalkaditya@gmail.com" },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-sm text-zinc-500 hover:text-orange-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* <div className="col-span-1 md:col-span-4">
                        <h4 className="font-semibold text-white mb-5 text-sm">Stay Updated</h4>
                        <p className="text-zinc-500 mb-4 text-sm leading-relaxed">
                            Get the latest prompt engineering tips and product updates.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="you@email.com"
                                className="flex-1 bg-white/5 border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
                            />
                            <button className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-orange-500 hover:to-amber-500 transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30">
                                Subscribe
                            </button>
                        </form>
                    </div> */}
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs">
                        © {new Date().getFullYear()} PromptOS. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs">
                        <Link href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
                        <Link href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
                        <Link href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
