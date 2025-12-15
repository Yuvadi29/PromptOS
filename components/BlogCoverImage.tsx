import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface BlogCoverImageProps {
    src?: string;
    title: string;
    slug?: string;
    className?: string;
    priority?: boolean;
}

// Function to generate a consistent gradient based on string (slug)
function getGradient(str: string) {
    const gradients = [
        "from-orange-500/20 to-purple-500/20",
        "from-blue-500/20 to-cyan-500/20",
        "from-green-500/20 to-emerald-500/20",
        "from-pink-500/20 to-rose-500/20",
        "from-amber-500/20 to-yellow-500/20",
    ];
    const index = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    return gradients[index];
}

export function BlogCoverImage({ src, title, slug = "blog", className, priority = false }: BlogCoverImageProps) {
    const hasImage = src && src !== "/placeholder-blog.jpg" && src.length > 0;
    const gradient = getGradient(slug);

    return (
        <div className={cn("relative w-full h-full overflow-hidden bg-neutral-950", className)}>
            {hasImage ? (
                <Image
                    src={src}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br flex items-center justify-center p-6 text-center group-hover:scale-105 transition-transform duration-700", gradient)}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <Sparkles className="w-12 h-12 text-white/20" />
                        <span className="text-xl md:text-2xl font-bold text-white/80 line-clamp-2 drop-shadow-sm">
                            {title}
                        </span>
                    </div>
                </div>
            )}
            {/* Overlay for better text readability or hover effect */}
            {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />}
        </div>
    );
}
