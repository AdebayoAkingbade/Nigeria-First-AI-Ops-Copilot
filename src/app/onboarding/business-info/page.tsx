'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { Info, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BusinessInfoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        industry: '',
        cac: '',
        date: '',
        size: '',
        revenue: '',
        goals: ''
    });

    useEffect(() => {
        async function checkAuth() {
            // First check session for fastest response
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // If no session, wait a brief moment and check again (handles slight delays in persistence)
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data: { session: retrySession } } = await supabase.auth.getSession();
                if (!retrySession) {
                    router.push('/onboarding/account-setup');
                    return;
                }
            }

            // Securely verify user
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                // Pre-fill if profile exists
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setFormData({
                        businessName: profile.business_name || '',
                        businessType: profile.business_type || '',
                        industry: profile.industry || '',
                        cac: profile.cac_registration_number || '',
                        date: profile.incorporation_date || '',
                        size: profile.business_size || '',
                        revenue: profile.monthly_revenue_range || '',
                        goals: profile.business_goals || ''
                    });
                }
            } else {
                router.push('/onboarding/account-setup');
            }
            setInitialLoading(false);
        }
        checkAuth();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    business_name: formData.businessName,
                    business_type: formData.businessType,
                    industry: formData.industry,
                    cac_registration_number: formData.cac,
                    incorporation_date: formData.date || null,
                    business_size: formData.size,
                    monthly_revenue_range: formData.revenue,
                    business_goals: formData.goals,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (updateError) throw updateError;

            router.push('/onboarding/upload-data');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-sm md:border">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Tell Us About Your Business</CardTitle>
                    <CardDescription className="text-base text-muted-foreground mt-2">
                        Help us understand your business better so we can provide more accurate insights and recommendations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="businessName"
                                    placeholder="e.g., Adebayo Fashion Store"
                                    required
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">Enter your registered business name or trading name</p>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                                <Select
                                    id="businessType"
                                    required
                                    value={formData.businessType}
                                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                >
                                    <option value="" disabled>Select business type</option>
                                    <option value="retail">Retail</option>
                                    <option value="service">Service</option>
                                    <option value="logistics">Logistics/Transport</option>
                                    <option value="hospitality">Hospitality/Food</option>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
                                <Select
                                    id="industry"
                                    required
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                >
                                    <option value="" disabled>Select your industry</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="groceries">Groceries</option>
                                    <option value="health">Health & Beauty</option>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-blue-50/50 p-4">
                            <div className="flex items-start gap-3">
                                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-sm">CAC Registration (Optional)</h4>
                                    <p className="text-sm text-muted-foreground">Adding your CAC details helps us provide better credit readiness scores and growth insights. You can skip this and add it later.</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cac">CAC Registration Number (RC/BN)</Label>
                                    <Input
                                        id="cac"
                                        placeholder="e.g., RC1234567 or BN2345678"
                                        value={formData.cac}
                                        onChange={(e) => setFormData({ ...formData, cac: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Incorporation Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Business Size <span className="text-red-500">*</span></Label>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { id: "micro", title: "Micro", desc: "1-5 employees" },
                                    { id: "small", title: "Small", desc: "6-20 employees" },
                                    { id: "medium", title: "Medium", desc: "21+ employees" }
                                ].map((size) => (
                                    <div
                                        key={size.id}
                                        onClick={() => setFormData({ ...formData, size: size.id })}
                                        className={`relative flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors ${formData.size === size.id ? 'border-primary bg-primary/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="size"
                                                id={size.id}
                                                checked={formData.size === size.id}
                                                onChange={() => setFormData({ ...formData, size: size.id })}
                                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <div>
                                                <label htmlFor={size.id} className="font-medium block cursor-pointer">{size.title}</label>
                                                <span className="text-xs text-muted-foreground">{size.desc}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="revenue">Monthly Revenue Range <span className="text-red-500">*</span></Label>
                            <Select
                                id="revenue"
                                required
                                value={formData.revenue}
                                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                            >
                                <option value="" disabled>Select revenue range</option>
                                <option value="0-1m">₦0 - ₦1,000,000</option>
                                <option value="1m-5m">₦1,000,000 - ₦5,000,000</option>
                                <option value="5m-plus">₦5,000,000+</option>
                            </Select>
                            <p className="text-xs text-muted-foreground">This helps us benchmark your performance against similar businesses</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="goals">What are your main business goals? (Optional)</Label>
                            <Textarea
                                id="goals"
                                placeholder="e.g., Reduce expenses, improve cash flow, get ready for a loan, scale operations..."
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                            <Button variant="outline" className="w-full sm:w-auto h-12 px-8" asChild>
                                <Link href="/onboarding/account-setup">Back</Link>
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 ml-auto"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Continue to Upload Data"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 rounded-lg bg-green-50 p-4 flex items-start gap-4">
                <div className="bg-green-600 rounded-full p-1 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-green-900">Why we ask for this information</h4>
                    <p className="text-sm text-green-800 mt-1 leading-relaxed">
                        Your business details help our AI provide more accurate insights, industry benchmarks, and personalized recommendations. All information is kept confidential and secure.
                    </p>
                </div>
            </div>
        </div>
    );
}
