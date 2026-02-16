import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-xl font-bold tracking-tight">PersonaStyle</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            How it Works
          </Link>
          <Link href="/history" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            History
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Button size="sm" asChild>
            <Link href="/analyze">Get Started</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
