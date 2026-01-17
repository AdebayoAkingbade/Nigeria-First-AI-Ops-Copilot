import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="bg-primary rounded-lg p-1.5">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">OpsCopilot</span>
                </div>

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

                <div className="flex items-center gap-4">
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
