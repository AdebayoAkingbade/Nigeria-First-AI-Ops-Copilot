import { AuthEntry } from "@/components/auth/auth-entry";

export default function LoginPage() {
    return (
        <AuthEntry
            title="Sign in in seconds"
            description="Use your phone number or continue with Google or Facebook to get back to your business summary."
            footerText="Need an account?"
            footerHref="/onboarding/account-setup"
            footerLabel="Start here"
        />
    );
}
