'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";
import { fetchApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function AccountSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        agreeToTerms: false,
    });
    const [confirmationRequired, setConfirmationRequired] = useState(false);

    const checkOnboardingStatusAndRedirect = async () => {
        try {
            // Fetch Profile from Java Backend
            const profile = await fetchApi('/profiles/me').catch(() => null);

            if (!profile || !profile.business_name) {
                router.push('/onboarding/business-info');
                return;
            }

            // check receipts via Java API
            const receipts = await fetchApi('/receipts').catch(() => []);

            if (!receipts || receipts.length === 0) {
                router.push('/onboarding/upload-data');
                return;
            }

            // All good
            router.push('/dashboard');
        } catch (err) {
            console.error("Redirection failure:", err);
            router.push('/onboarding/business-info');
        }
    };

    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await checkOnboardingStatusAndRedirect();
            }
        }
        checkUser();
    }, [router]);

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setLoading(true);
        setError(null);
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("postAuthRedirect", "/onboarding/business-info");
            }
            const { error: authError } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (authError) throw authError;
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setConfirmationRequired(false);

        try {
            if (typeof window !== "undefined") {
                localStorage.setItem("postAuthRedirect", "/onboarding/business-info");
            }
            const { data, error: signupError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        phone: `+234${formData.phone}`,
                    }
                }
            });

            if (signupError) throw signupError;

            if (data.user) {
                // If email confirmation is enabled, session will be null
                if (!data.session) {
                    setConfirmationRequired(true);
                    return;
                }

                // Profile is automatically created by trigger or we can do it manually here if no trigger exists
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        whatsapp_number: `+234${formData.phone}`,
                    });

                if (profileError) throw profileError;

                router.push('/onboarding/business-info');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-sm md:border">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Start Your Free Trial</CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        Get instant business insights in under 10 minutes. No credit card required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    {confirmationRequired && (
                        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm space-y-2">
                            <h4 className="font-bold">Confirmation email sent!</h4>
                            <p>Please check your email and click the confirmation link to complete your setup. Once confirmed, you'll be able to continue to the next step.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 text-green-800 border-green-200 hover:bg-green-100"
                                onClick={() => setConfirmationRequired(false)}
                            >
                                Back to signup
                            </Button>
                        </div>
                    )}
                    {!confirmationRequired && (
                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="Adebayo"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Ogunleye"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="flex">
                                    <div className="flex items-center px-3 border rounded-l-md border-r-0 bg-muted/50 text-muted-foreground">
                                        <span className="text-sm">🇳🇬 +234</span>
                                    </div>
                                    <Input
                                        id="phone"
                                        className="rounded-l-none"
                                        placeholder="8012345678"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">We'll contact you via WhatsApp for insights</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="adebayo@business.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                                        required
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-lg"
                                    disabled={loading || !formData.agreeToTerms}
                                >
                                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Continue to Business Info"}
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-11 flex items-center gap-2"
                            disabled={loading}
                            onClick={() => handleSocialLogin('google')}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>
                        <Button
                            variant="outline"
                            className="h-11 flex items-center gap-2"
                            disabled={loading}
                            onClick={() => handleSocialLogin('facebook')}
                        >
                            <svg className="h-5 w-5 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </Button>
                    </div>

                    <div className="pt-6 text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-xl bg-purple-50 text-purple-900 w-full">
                            <span className="mr-3 bg-purple-600 text-white rounded-full p-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
                            </span>
                            <div className="text-left">
                                <h4 className="font-bold text-sm">Your data is secure</h4>
                                <p className="text-xs opacity-90">We use bank-level encryption. Your financial data is never shared.</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Log in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
