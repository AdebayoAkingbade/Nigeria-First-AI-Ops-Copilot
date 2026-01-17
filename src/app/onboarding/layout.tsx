import { Stepper } from "@/components/onboarding/stepper";
import { Brain } from "lucide-react";
import Link from "next/link";

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
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary rounded-lg p-1.5">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">OpsCopilot</span>
                    </div>
                    <Link href="/" className="text-sm text-gray-500 hover:text-foreground">
                        Back to Business Info
                    </Link>
                </div>
            </header>

            <OnboardingLayoutClient>
                {children}
            </OnboardingLayoutClient>
        </div>
    );
}
