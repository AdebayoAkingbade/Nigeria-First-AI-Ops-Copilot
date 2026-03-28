import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/">
                    <KudiPalLogo compact />
                </Link>

                <nav className="hidden md:flex gap-6">
                    <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Features
                    </Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        How It Works
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link href="/login" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Log in
                    </Link>
                    <Link href="/onboarding/business-info">
                        <Button>Start Free Trial</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
