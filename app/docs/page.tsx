'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Book, Search, Menu, X, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiSection {
    id: string;
    title: string;
    content: string;
}

export default function DocsPage() {
    const [markdown, setMarkdown] = useState('');
    const [sections, setSections] = useState<ApiSection[]>([]);
    const [activeSection, setActiveSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Fetch the API.md file
        fetch('/docs/API.md')
            .then(res => res.text())
            .then(text => {
                setMarkdown(text);
                // Parse sections from markdown
                const apiSections = parseApiSections(text);
                setSections(apiSections);
                if (apiSections.length > 0) {
                    setActiveSection(apiSections[0].id);
                }
            });
    }, []);

    const parseApiSections = (text: string): ApiSection[] => {
        const sections: ApiSection[] = [];
        const lines = text.split('\n');
        let currentSection: ApiSection | null = null;
        let currentContent: string[] = [];

        for (const line of lines) {
            // Look for API endpoint headers (e.g., "## API Documentation: /api/...")
            if (line.includes('/api/') && (line.startsWith('##') || line.includes('Endpoint:'))) {
                // Save previous section
                if (currentSection) {
                    currentSection.content = currentContent.join('\n');
                    sections.push(currentSection);
                }

                // Extract endpoint path
                const match = line.match(/\/api\/[^\s\])]*/);
                if (match) {
                    const endpoint = match[0];
                    const id = endpoint.replace(/\//g, '-').replace(/\[|\]/g, '');
                    currentSection = {
                        id,
                        title: endpoint,
                        content: ''
                    };
                    currentContent = [line];
                }
            } else if (currentSection && !line.startsWith('---')) {
                currentContent.push(line);
            } else if (line.startsWith('---') && currentSection) {
                currentSection.content = currentContent.join('\n');
                sections.push(currentSection);
                currentSection = null;
                currentContent = [];
            }
        }

        return sections;
    };

    const filteredSections = sections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        <Book className="w-6 h-6 text-orange-500" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            API Documentation
                        </h1>
                    </div>

                    <div className="relative max-w-md w-full hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            placeholder="Search APIs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-zinc-800 border-zinc-700 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-16 h-[calc(100vh-4rem)] w-80 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        } z-40`}
                >
                    <div className="p-6 space-y-2">
                        <h2 className="text-sm font-semibold text-zinc-400 mb-4">ENDPOINTS ({filteredSections.length})</h2>
                        {filteredSections.map((section, index) => (
                            <motion.button
                                key={section.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.02 }}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all group ${activeSection === section.id
                                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                        : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-mono truncate">{section.title}</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === section.id ? 'text-orange-400' : 'opacity-0 group-hover:opacity-100'
                                        }`} />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : ''}`}>
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                        {filteredSections.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-zinc-500">No APIs found matching your search.</p>
                            </div>
                        ) : (
                            <div className="space-y-16">
                                {filteredSections.map((section) => (
                                    <motion.section
                                        key={section.id}
                                        id={section.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="scroll-mt-24"
                                    >
                                        <div className="prose prose-invert prose-orange max-w-none">
                                            <div className="mb-6 pb-4 border-b border-zinc-800">
                                                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                                    {section.title}
                                                </h2>
                                            </div>
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ children }) => (
                                                        <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>
                                                    ),
                                                    h2: ({ children }) => (
                                                        <h2 className="text-xl font-semibold text-zinc-200 mb-3 mt-6">{children}</h2>
                                                    ),
                                                    h3: ({ children }) => (
                                                        <h3 className="text-lg font-semibold text-zinc-300 mb-2 mt-4">{children}</h3>
                                                    ),
                                                    p: ({ children }) => (
                                                        <p className="text-zinc-400 mb-4 leading-relaxed">{children}</p>
                                                    ),
                                                    code: ({ inline, children, ...props }: any) => (
                                                        inline ? (
                                                            <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-orange-400 text-sm font-mono" {...props}>
                                                                {children}
                                                            </code>
                                                        ) : (
                                                            <code className="block p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono overflow-x-auto" {...props}>
                                                                {children}
                                                            </code>
                                                        )
                                                    ),
                                                    pre: ({ children }) => (
                                                        <pre className="mb-4 overflow-x-auto">{children}</pre>
                                                    ),
                                                    ul: ({ children }) => (
                                                        <ul className="list-disc list-inside text-zinc-400 mb-4 space-y-1">{children}</ul>
                                                    ),
                                                    ol: ({ children }) => (
                                                        <ol className="list-decimal list-inside text-zinc-400 mb-4 space-y-1">{children}</ol>
                                                    ),
                                                    li: ({ children }) => (
                                                        <li className="text-zinc-400">{children}</li>
                                                    ),
                                                    a: ({ href, children }) => (
                                                        <a href={href} className="text-orange-400 hover:text-orange-300 underline">
                                                            {children}
                                                        </a>
                                                    ),
                                                }}
                                            >
                                                {section.content}
                                            </ReactMarkdown>
                                        </div>
                                    </motion.section>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
