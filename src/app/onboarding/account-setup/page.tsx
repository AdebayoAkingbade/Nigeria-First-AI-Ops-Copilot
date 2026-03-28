import { AuthEntry } from "@/components/auth/auth-entry";

export default function AccountSetupPage() {
    return (
        <AuthEntry
            title="Start with your phone number"
            description="Understand your business money in minutes. We&apos;ll send a quick code, then help you upload your statement and get simple insights on WhatsApp."
            footerText="Already have an account?"
            footerHref="/login"
            footerLabel="Sign in"
            showIntro={false}
        />
    );
}
