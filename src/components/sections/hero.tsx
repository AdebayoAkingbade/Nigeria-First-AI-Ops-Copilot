import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-primary pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/20 blur-3xl"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center md:text-left">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-center md:items-start space-y-8 animate-in slide-in-from-left duration-500">
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
                            New: Whatsapp Integration
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                            Your AI Operations Manager in Your <span className="text-secondary">Pocket</span>
                        </h1>

                        <p className="max-w-xl text-lg md:text-xl text-white/80 leading-relaxed">
                            The first AI agent dedicated to helping African SMBs run operations, cut costs, and grow profits on Autopilot.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link href="/onboarding/business-info">
                                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold h-14 px-8 w-full sm:w-auto">
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-8 gap-2">
                                <PlayCircle className="h-5 w-5" />
                                Watch Demo
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-white/60 pt-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-primary bg-gray-300"></div>
                                ))}
                            </div>
                            <span>Trusted by 500+ Businesses</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none animate-in slide-in-from-right duration-700 delay-100">
                        
                        <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl">
                            <div className="rounded-lg bg-white/95 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200"></div>
                               
                                <div className="absolute top-4 left-4 right-4 h-8 bg-white rounded shadow-sm"></div>
                                <div className="absolute top-16 left-4 right-1/2 h-24 bg-white rounded shadow-sm"></div>
                                <div className="absolute top-16 right-4 left-1/2 ml-4 h-24 bg-white rounded shadow-sm"></div>
                                <div className="absolute bottom-4 left-4 right-4 top-44 bg-white rounded shadow-sm"></div>

                                <div className="absolute bottom-6 right-6 bg-primary text-white text-xs px-2 py-1 rounded shadow-lg">
                                    ₦2,450,000
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
