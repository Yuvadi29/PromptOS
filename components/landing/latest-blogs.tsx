import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogCoverImage } from "@/components/BlogCoverImage";

interface Post {
    slug: string;
    title: string;
    subtitle: string;
    date: string;
    author: string;
    readingTime?: string;
    coverImage?: string;
}

function getLatestPosts(): Post[] {
    const postsDir = path.join(process.cwd(), "posts");
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir);

    return files
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(".mdx", "");
            const fullPath = path.join(postsDir, file);
            const raw = fs.readFileSync(fullPath, "utf8");
            const { data } = matter(raw);

            return {
                slug,
                title: data.title,
                subtitle: data.subtitle,
                date: data.date,
                author: data.author,
                readingTime: data.readingTime || "5 min read",
                coverImage: data.coverImage
            } as Post;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
}

export default function LatestBlogs() {
    const posts = getLatestPosts();

    if (posts.length === 0) return null;

    return (
        <section className="py-24 bg-black/40 relative overflow-hidden border-t border-white/5">
            <div className="container px-4 mx-auto relative z-10">

                <div className="text-center mb-16 space-y-4">
                    <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/5 px-4 py-1.5 uppercase tracking-wider text-xs">
                        From the Blog
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Latest Insights
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Deep dives into prompt engineering, LLM comparisons, and AI workflows.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                            <Card className="h-full bg-zinc-900/50 border-white/10 hover:border-orange-500/30 hover:bg-zinc-900/80 transition-all duration-300 flex flex-col overflow-hidden group-hover:-translate-y-1">
                                <div className="h-48 relative overflow-hidden bg-neutral-950">
                                    <BlogCoverImage
                                        src={post.coverImage}
                                        title={post.title}
                                        slug={post.slug}
                                    />
                                </div>

                                <CardContent className="flex-1 p-6 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-orange-400/80 font-medium">
                                        <Calendar className="w-3 h-3" />
                                        {post.date}
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight text-zinc-100 group-hover:text-orange-200 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {post.subtitle}
                                    </p>
                                </CardContent>

                                <CardFooter className="p-6 pt-0 mt-auto border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs text-zinc-500">{post.readingTime}</span>
                                    <span className="text-sm font-medium text-orange-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read Article <ArrowRight className="w-3 h-3" />
                                    </span>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-orange-400 transition-colors border-b border-transparent hover:border-orange-400 pb-0.5"
                    >
                        View all posts <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    );
}
