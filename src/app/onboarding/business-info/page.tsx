import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

export default function BusinessInfoPage() {
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

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
                            <Input id="businessName" placeholder="e.g., Adebayo Fashion Store" />
                            <p className="text-xs text-muted-foreground">Enter your registered business name or trading name</p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="businessType">Business Type <span className="text-red-500">*</span></Label>
                            <Select id="businessType">
                                <option value="" disabled selected>Select business type</option>
                                <option value="retail">Retail</option>
                                <option value="service">Service</option>
                                <option value="logistics">Logistics/Transport</option>
                                <option value="hospitality">Hospitality/Food</option>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
                            <Select id="industry">
                                <option value="" disabled selected>Select your industry</option>
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
                                <Input id="cac" placeholder="e.g., RC1234567 or BN2345678" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date">Incorporation Date</Label>
                                <Input id="date" type="date" placeholder="dd/mm/yyyy" />
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
                                <div key={size.id} className="relative flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="size" id={size.id} className="h-4 w-4 border-gray-300 text-primary focus:ring-primary" />
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
                        <Select id="revenue">
                            <option value="" disabled selected>Select revenue range</option>
                            <option value="0-1m">₦0 - ₦1,000,000</option>
                            <option value="1m-5m">₦1,000,000 - ₦5,000,000</option>
                            <option value="5m-plus">Active ₦5,000,000+</option>
                        </Select>
                        <p className="text-xs text-muted-foreground">This helps us benchmark your performance against similar businesses</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="goals">What are your main business goals? (Optional)</Label>
                        <Textarea id="goals" placeholder="e.g., Reduce expenses, improve cash flow, get ready for a loan, scale operations..." />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                        <Button variant="outline" className="w-full sm:w-auto h-12 px-8" asChild>
                            <Link href="/">Back</Link>
                        </Button>
                        <Button className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 ml-auto" asChild>
                            <Link href="/onboarding/upload-data">Continue to Upload Data</Link>
                        </Button>
                    </div>

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
