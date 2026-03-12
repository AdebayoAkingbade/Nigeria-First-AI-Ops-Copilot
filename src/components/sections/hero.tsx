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
                            <Link href="/onboarding/account-setup">
                                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-semibold h-14 px-8 w-full sm:w-auto">
                                    Start Free Trial
                                </Button>
                            </Link>
                             <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/20 hover:text-white h-14 px-8 gap-2 backdrop-blur-sm">
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

                     <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none animate-in slide-in-from-right duration-700 delay-100">
                        <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3 shadow-2xl overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           <img 
                                src="/images/hero-dashboard.png" 
                                alt="OpsCopilot AI Dashboard" 
                                className="w-full h-auto rounded-xl shadow-lg ring-1 ring-white/10 transform transition-transform duration-700 group-hover:scale-[1.02]"
                           />
                           
                           {/* Decorative elements */}
                           <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-secondary/20 blur-3xl rounded-full"></div>
                           <div className="absolute -top-6 -left-6 h-32 w-32 bg-primary/20 blur-3xl rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
