import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BlogCoverImage } from "@/components/BlogCoverImage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - PromptOS',
  description: 'Insights, tutorials, and updates on prompt engineering and LLM technology from the PromptOS team.',
};

interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  readingTime?: string;
  tags?: string[];
  coverImage?: string;
}

function getPosts(): Post[] {
  const postsDir = path.join(process.cwd(), "posts");
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
        readingTime: data.readingTime || "5 min read", // Placeholder or calc
        tags: data.tags || ["General"],
        coverImage: data.coverImage,
      } as Post;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function BlogPage() {
  const posts = getPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background text-foreground/90 py-20 px-6 sm:px-10 lg:px-20 font-sans selection:bg-orange-500/30">

      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-20 text-center space-y-6">
        <Badge variant="outline" className="px-4 py-1.5 border-orange-500/30 text-orange-400 bg-orange-500/5 text-sm uppercase tracking-widest">
          The PromptOS Blog
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
          Insights & Updates
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore the latest thinking on AI prompting, engineering, and the future of LLMs.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-24">

        {/* Featured Post */}
        {featuredPost && (
          <section className="relative group rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-1">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-[#0A0A0A] rounded-[22px] overflow-hidden grid lg:grid-cols-5 gap-0">
              {/* Image Side */}
              <div className="lg:col-span-3 h-80 lg:h-auto overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 lg:hidden" />
                <BlogCoverImage
                  src={featuredPost.coverImage}
                  title={featuredPost.title}
                  slug={featuredPost.slug}
                  priority
                  className="h-full w-full"
                />
              </div>

              {/* Content Side */}
              <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center space-y-6 z-20">
                <div className="flex items-center gap-3 text-xs md:text-sm text-orange-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {featuredPost.date}</span>
                  <span className="w-1 h-1 rounded-full bg-orange-500/50" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readingTime}</span>
                </div>

                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-orange-100 transition-colors">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-muted-foreground text-lg line-clamp-3">
                  {featuredPost.subtitle}
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-black text-xs">
                      {featuredPost.author.charAt(0)}
                    </div>
                    {featuredPost.author}
                  </div>

                  <Button asChild variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 group/btn">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Latest Blogs Grid */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" /> Latest Posts
            </h3>
            {/* Could add filters here */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full bg-white/5 border-white/10 hover:border-orange-500/30 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Card Image area */}
                  <div className="h-48 bg-neutral-900 border-b border-white/5 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                    <BlogCoverImage
                      src={post.coverImage}
                      title={post.title}
                      slug={post.slug}
                    />
                  </div>

                  <CardContent className="flex-1 p-6 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-orange-400/80">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-orange-500/30" />
                      <span>{post.readingTime}</span>
                    </div>

                    <h4 className="text-xl font-bold leading-snug group-hover:text-orange-200 transition-colors">
                      {post.title}
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.subtitle}
                    </p>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-white/5">
                    <div className="text-xs text-white/50 flex items-center gap-2">
                      <User className="w-3 h-3" /> {post.author}
                    </div>
                    <span className="text-xs font-medium text-orange-500 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {otherPosts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              More posts coming soon...
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
