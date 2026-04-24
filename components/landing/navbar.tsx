import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl backdrop-blur-md bg-background/70 border-b border-border/40 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-semibold tracking-tight text-foreground transition-colors hover:opacity-80">
          PromptOS
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#how-it-works" className="hover:text-foreground transition-colors">Platform</Link>
        <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/dashboard">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full text-foreground hover:bg-muted transition-colors">
            Log in
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all shadow-sm">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
}
