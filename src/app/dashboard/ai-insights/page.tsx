'use client'

import { useState } from "react";
import {
    Brain,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Zap,
    TrendingUp,
    Target,
    ShieldCheck,
    MessageSquare,
    ChevronRight,
    Search,
    Filter,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AIInsightsPage() {
    const insights = [
        {
            type: "Critical",
            title: "Overstock Warning: Nike Sneakers",
            description: "Based on current sales velocity, your current stock will last 8 months. Capital is being tied up unproductively.",
            action: "Clearance Sale",
            impact: "₦145,000 cash recovery",
            color: "text-red-600 bg-red-50 border-red-100",
            icon: <AlertCircle className="h-5 w-5" />
        },
        {
            type: "Opportunity",
            title: "Weekend Demand Spike",
            description: "Data shows a 45% increase in orders for 'Accessories' during Saturdays between 11 AM - 3 PM.",
            action: "Add 1 Temporary Staff",
            impact: "Reduce wait time by 20%",
            color: "text-blue-600 bg-blue-50 border-blue-100",
            icon: <Sparkles className="h-5 w-5" />
        },
        {
            type: "Efficiency",
            title: "Optimize Vendor Deliveries",
            description: "Ahmad Logistics has been late 4 times this month. Switching to reliable partners could save business hours.",
            action: "Review Contract",
            impact: "12 hours saved/month",
            color: "text-purple-600 bg-purple-50 border-purple-100",
            icon: <Zap className="h-5 w-5" />
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header Area */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-primary mb-4 border border-white/10 backdrop-blur-md">
                            <Brain className="h-3 w-3" /> AI Engine Active
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                            Smart insights for <span className="text-primary italic">smarter</span> decisions.
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed mb-8">
                            We've analyzed your latest uploads and identified 3 key actions to take this week.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8 font-bold">
                                Regenerate Analysis
                            </Button>
                            <Button variant="outline" className="h-12 border-white/20 hover:bg-white/10 hover:text-white">
                                <MessageSquare className="mr-2 h-4 w-4" /> Connect WhatsApp
                            </Button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="h-64 w-64 bg-primary/20 rounded-full absolute -top-10 -right-10 blur-[80px]"></div>
                        <div className="h-48 w-48 border-2 border-white/10 rounded-3xl rotate-12 flex items-center justify-center backdrop-blur-sm relative">
                            <Brain className="h-24 w-24 text-primary animate-pulse" />
                        </div>
                    </div>
                </div>
                {/* Abstract shapes */}
                <div className="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 200 Q 200 100 400 200 T 800 200" fill="none" stroke="white" strokeWidth="1" />
                        <path d="M0 250 Q 200 150 400 250 T 800 250" fill="none" stroke="white" strokeWidth="1" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Insights Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-lg">Daily Actions</h3>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-400 font-bold hover:text-slate-900">Archive All</Button>
                        </div>
                    </div>

                    {insights.map((insight, i) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group border-l-4 border-l-transparent hover:border-l-primary overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-xl p-2 ${insight.color} border group-hover:scale-110 transition-transform`}>
                                                {insight.icon}
                                            </div>
                                            <div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${insight.color.split(' ')[0]}`}>
                                                    {insight.type}
                                                </span>
                                                <h4 className="font-bold text-slate-900">{insight.title}</h4>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-900">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                        {insight.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t font-bold">
                                        <div className="flex-1 text-xs text-slate-400">
                                            SUGGESTED ACTION: <span className="text-slate-900 ml-1">{insight.action}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                                            <TrendingUp className="h-3 w-3" /> {insight.impact}
                                        </div>
                                        <Button className="h-9 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-lg">Apply Fix</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Automation & Config area */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Insight Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">Email Summaries</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">Get insights in your inbox daily</p>
                                    </div>
                                    <div className="h-6 w-11 bg-slate-200 rounded-full relative transition-colors group-hover:bg-slate-300">
                                        <div className="h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                                    </div>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">WhatsApp Alerts</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">Instant alerts on critical issues</p>
                                    </div>
                                    <div className="h-6 w-11 bg-primary rounded-full relative transition-colors">
                                        <div className="h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                    </div>
                                </label>
                            </div>

                            <div className="pt-6 border-t mt-6">
                                <h5 className="text-sm font-bold text-slate-900 mb-3">AI Model Precision</h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Current: GPT-4o</span>
                                        <span className="text-primary">98% Accuracy</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[98%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                Data Reliability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                Our AI is currently analyzing data from **2 bank accounts** and **4 document types**. Increase accuracy by uploading more historical data.
                            </p>
                            <Button variant="outline" className="w-full h-11 border-dashed font-bold hover:bg-slate-50 group-hover:border-primary group-hover:text-primary transition-all">
                                Add more data sources
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="relative z-10">
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-md">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">Scale with Confidence</h4>
                            <p className="text-white/70 text-sm mb-6 max-w-[200px] mx-auto">
                                Let AI manage your daily operations while you focus on vision.
                            </p>
                            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-11">
                                Upgrade Plan
                            </Button>
                        </div>
                        {/* More decorative blur */}
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
