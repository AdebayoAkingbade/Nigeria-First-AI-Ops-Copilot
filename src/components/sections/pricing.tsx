import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
    const plans = [
        {
            name: "Free",
            price: "₦0",
            period: "Forever free",
            features: [
                "Up to 50 sales/month",
                "Basic financial reports",
                "WhatsApp daily summary",
                "1 user account",
            ],
            cta: "Get Started Free",
            variant: "outline" as const,
            popular: false,
        },
        {
            name: "Plus",
            price: "₦5,000",
            period: "per month",
            features: [
                "Unlimited sales",
                "Advanced AI expenses",
                "Inventory tracking",
                "Credit readiness score",
                "Priority support 24/7",
            ],
            cta: "Start 14-Day Trial",
            variant: "default" as const,
            popular: true,
        },
        {
            name: "Business",
            price: "₦10,000",
            period: "per month",
            features: [
                "Everything in Plus",
                "Multiple branches",
                "Staff accounts (up to 5)",
                "Dedicated account manager",
                "API access",
            ],
            cta: "Contact Sales",
            variant: "outline" as const,
            popular: false,
        },
    ];

    return (
        <section className="py-20 bg-white" id="pricing">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        No hidden fees. Upgrade as you grow. Cancel anytime.
                    </p>

                    <div className="inline-flex rounded-lg bg-gray-100 p-1 mb-8">
                        <button className="rounded-md bg-white px-4 py-2 text-sm font-medium shadow-sm">Monthly</button>
                        <button className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Yearly (-20%)</button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <div key={i} className={`relative flex flex-col p-8 rounded-2xl border ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-gray-200'}`}>
                            {plan.popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground text-sm">{plan.period !== "Forever free" && plan.period}</span>
                                </div>
                                {plan.period === "Forever free" && <span className="text-muted-foreground text-sm block h-5"></span>}
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, f) => (
                                    <div key={f} className="flex items-start gap-3 text-sm">
                                        <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </ul>

                            <Button
                                variant={plan.variant}
                                className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                                size="lg"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
