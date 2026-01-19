import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AccountSetupPage() {
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
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="Adebayo" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Ogunleye" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex">
                            <div className="flex items-center px-3 border rounded-l-md border-r-0 bg-muted/50 text-muted-foreground">
                                <span className="text-sm">🇳🇬 +234</span>
                            </div>
                            <Input id="phone" className="rounded-l-none" placeholder="8012345678" />
                        </div>
                        <p className="text-xs text-muted-foreground">We'll send you a verification code via SMS</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="adebayo@business.com" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Create a strong password" />
                        <p className="text-xs text-muted-foreground">Minimum 8 characters with letters and numbers</p>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-start space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                            </label>
                        </div>
                        <div className="flex items-start space-x-2">
                            <Checkbox id="marketing" />
                            <label
                                htmlFor="marketing"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Send me product updates and business tips via email and WhatsApp
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-lg" asChild>
                            <Link href="/onboarding/business-info">Continue to Business Info</Link>
                        </Button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-11">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" className="h-11">
                            <svg className="mr-2 h-4 w-4 text-blue-600" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
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
                                <p className="text-xs opacity-90">We use bank-level encryption. Your financial data is never shared without permission.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
