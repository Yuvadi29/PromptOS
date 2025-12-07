'use client';

import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="relative bg-zinc-950 border-t border-zinc-900">
            <div className="container px-4 py-12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                PromptOS
                            </span>
                        </div>
                        <p className="text-zinc-400 max-w-md mb-4">
                            The intelligent prompt operating system that transforms how you interact with AI.
                            Built for developers, by developers.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/Yuvadi29/PromptOS/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-zinc-900 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-500 transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@adityatrivedidev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-zinc-900 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-500 transition-colors"
                            >
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/adityat1702/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-zinc-900 hover:bg-orange-500/10 text-zinc-400 hover:text-orange-500 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/enhance" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Enhance
                                </Link>
                            </li>
                            <li>
                                <Link href="/prompt-library" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Library
                                </Link>
                            </li>
                            <li>
                                <Link href="/prompt-scoring" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Scoring
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="#" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Careers
                                </Link>
                            </li> */}
                            <li>
                                <Link href="#" className="text-zinc-400 hover:text-orange-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-zinc-500">
                        © 2025 PromptOS. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="text-zinc-500 hover:text-orange-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-orange-400 transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-zinc-500 hover:text-orange-400 transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
