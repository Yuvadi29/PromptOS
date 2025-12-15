import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Share2, Sparkles, AlertCircle, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogCoverImage } from "@/components/BlogCoverImage";
import ShareButton from "@/components/blog/share-button";
import Image from "next/image";

// Custom MDX Components
const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-10 mb-6 text-orange-100" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-10 mb-4 text-orange-200 border-b border-orange-500/20 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-8 mb-3 text-orange-300" {...props} />,
  p: (props: any) => <p className="leading-relaxed mb-6 text-neutral-300 text-lg" {...props} />,
  ul: (props: any) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-neutral-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-neutral-300" {...props} />,
  li: (props: any) => <li className="pl-1" {...props} />,
  blockquote: (props: any) => (
    <div className="relative pl-6 italic my-8 text-orange-200/90 border-l-4 border-orange-500 bg-orange-500/5 p-6 rounded-r-lg">
      <Quote className="absolute top-4 left-4 w-6 h-6 text-orange-500/20 -z-10 transform -translate-x-3 -translate-y-3" />
      <blockquote {...props} className="relative z-10 font-serif text-xl" />
    </div>
  ),
  a: (props: any) => <a className="text-orange-400 hover:text-orange-300 underline underline-offset-4 decoration-orange-500/30 hover:decoration-orange-500 transition-all font-medium" {...props} />,
  hr: (props: any) => <hr className="my-10 border-white/10" {...props} />,
  img: (props: any) => (
    <span className="my-8 relative rounded-xl overflow-hidden border border-white/10 group block">
      <Image className="w-full h-auto transform transition-transform duration-700 group-hover:scale-[1.02]" alt={props.alt || "Blog Image"} {...props} width={100} height={100}/>
    </span>
  ),
  code: (props: any) => <code className="bg-white/10 rounded px-1.5 py-0.5 text-orange-200 font-mono text-sm" {...props} />,
  pre: (props: any) => (
    <pre className="overflow-x-auto p-4 rounded-xl bg-[#0d1117] border border-white/10 my-6 text-sm leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" {...props} />
  ),
  // Custom Callout Component
  Callout: ({ type = "info", title, children }: any) => {
    const colors = {
      info: "bg-blue-500/10 border-blue-500/30 text-blue-200",
      warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
      danger: "bg-red-500/10 border-red-500/30 text-red-200",
      success: "bg-green-500/10 border-green-500/30 text-green-200",
    };
    const icons = {
      info: AlertCircle,
      warning: AlertCircle,
      danger: AlertCircle,
      success: Sparkles,
    };
    const Icon = icons[type as keyof typeof icons] || AlertCircle;

    return (
      <div className={`my-8 p-6 rounded-xl border ${colors[type as keyof typeof colors]} flex gap-4 items-start`}>
        <Icon className="w-6 h-6 flex-shrink-0 mt-1 opacity-70" />
        <div>
          {title && <h4 className="font-bold mb-2 flex items-center gap-2">{title}</h4>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    );
  },
};

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "posts");
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(".mdx", "") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postPath = path.join(process.cwd(), "posts", `${slug}.mdx`);

  if (!fs.existsSync(postPath)) {
    return {
      title: 'Post Not Found',
    };
  }

  const raw = fs.readFileSync(postPath, "utf8");
  const { data } = matter(raw);

  return {
    title: `${data.title} - PromptOS Blog`,
    description: data.subtitle || 'Read this article on PromptOS.',
    openGraph: {
      title: data.title,
      description: data.subtitle,
      type: 'article',
      url: `https://promptos.ai/blog/${slug}`,
      images: [
        {
          url: `/blog/${slug}/opengraph-image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.subtitle,
      images: [`/blog/${slug}/opengraph-image`],
    },
  };
}

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postPath = path.join(process.cwd(), "posts", `${slug}.mdx`);

  if (!fs.existsSync(postPath)) {
    return <div className="p-20 text-center">Post not found</div>;
  }

  const raw = fs.readFileSync(postPath, "utf8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
    components,
  });

  return (
    <div className="min-h-screen bg-background text-foreground/90 selection:bg-orange-500/30 pb-20">

      {/* Featured Header Image / Gradient */}
      <div className="h-[40vh] w-full relative overflow-hidden bg-neutral-900 border-b border-white/5">
        <BlogCoverImage
          src={data.coverImage}
          title={data.title}
          slug={slug}
          priority
          className="h-full w-full"
        />
        {/* Overlay to ensure text readability if it overlaps, though title is below in layout usually */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-20">

        {/* Navigation */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-orange-400 transition-colors mb-8 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/5 hover:border-orange-500/30"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Article Header */}
        <div className="space-y-6 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 bg-orange-500/5 hover:bg-orange-500/10">
              {data.tags?.[0] || "Blog"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" /> {data.date}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> {data.readingTime || "5 min read"}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {data.title}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
            {data.subtitle}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center font-bold text-black shadow-lg shadow-orange-500/20">
                {data.author?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-semibold text-white">{data.author}</div>
                <div className="text-xs text-muted-foreground">Author</div>
              </div>
            </div>

            <ShareButton
              title={data.title}
              text={data.subtitle}
              url={`https://promptos.ai/blog/${slug}`}
            />
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-invert max-w-none prose-lg prose-headings:scroll-mt-20">
          {mdxContent}
        </article>

      </div>
    </div>
  );
}
