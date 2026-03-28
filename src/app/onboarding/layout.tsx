import { Stepper } from "@/components/onboarding/stepper";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { KudiPalLogo } from "@/components/branding/kudipal-logo";

// We need a way to determine current step. 
// Ideally we check pathname, but Layout receives children.
// We can parse headers or use explicit props if this was a template?
// But creating a client component just for the stepper wrapper is easiest.
// Or we just hardcode step based on route segments in the layout if it was dynamic, OR
// actually, simple client component wrapper is better.
// But for now, since I can't easily pass pathname to server layout without headers(), 
// I'll make a client wrapper component `OnboardingWrapper` that uses `usePathname`.

import { OnboardingLayoutClient } from "./layout-client";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Simple Header */}
            <header className="bg-white border-b py-4">
                <div className="container mx-auto px-4 flex items-center gap-5">
                    <KudiPalLogo compact />
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                        Back to home
                    </Link>
                </div>
            </header>

            <OnboardingLayoutClient>
                {children}
            </OnboardingLayoutClient>
        </div>
    );
}
