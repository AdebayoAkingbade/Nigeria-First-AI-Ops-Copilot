import { BarChart3, LineChart, Cpu, Receipt, PieChart, TrendingUp } from "lucide-react";

export function Features() {
    const features = [
        {
            title: "Business Health Snapshot",
            description: "Instant view of your revenue, expenses, and profit margins.",
            icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
            bg: "bg-purple-100",
        },
        {
            title: "Cash Flow Analysis",
            description: "Track money in vs. money out and predict your future cash flow.",
            icon: <LineChart className="h-6 w-6 text-green-600" />,
            bg: "bg-green-100",
        },
        {
            title: "AI Cost Assistant",
            description: "Get smart suggestions on where to cut costs without hurting quality.",
            icon: <Cpu className="h-6 w-6 text-blue-600" />,
            bg: "bg-blue-100",
        },
        {
            title: "Expense Categorization",
            description: "Automatically tags your spending (e.g., Inventory, Rent, Salaries).",
            icon: <Receipt className="h-6 w-6 text-orange-600" />,
            bg: "bg-orange-100",
        },
        {
            title: "Credit Readiness Score",
            description: "Know exactly when you qualify for a loan and how to improve your score.",
            icon: <PieChart className="h-6 w-6 text-pink-600" />,
            bg: "bg-pink-100",
        },
        {
            title: "Growth Insights",
            description: "Data-driven tips on which products or services are making you the most money.",
            icon: <TrendingUp className="h-6 w-6 text-indigo-600" />,
            bg: "bg-indigo-100",
        },
    ];

    return (
        <section className="py-20 md:py-28 bg-white" id="features">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Powerful Features for SMBs
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to grow your business, powered by advanced AI but built for simplicity.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                            <div className={`mt-1 h-10 w-10 flex-shrink-0 rounded-lg flex items-center justify-center ${feature.bg}`}>
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
