'use client'

import { useState } from "react";
import {
    TrendingUp,
    ArrowUpRight,
    DollarSign,
    BarChart3,
    PieChart,
    Calendar,
    Search,
    Download,
    Plus,
    Target,
    Zap,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RevenuePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Revenue Performance</h1>
                    <p className="text-slate-500">Monitor your sales growth and customer lifetime value.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" /> Add Sales Data
                    </Button>
                </div>
            </div>

            {/* Main Sales Chart (Placeholder Visual) */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Revenue Forecast</CardTitle>
                            <CardDescription>Estimated revenue based on current trends</CardDescription>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 p-1 bg-slate-50 rounded-lg border text-xs font-bold">
                            <span className="px-3 py-1 bg-white shadow-sm border rounded-md">Weekly</span>
                            <span className="px-3 py-1 text-slate-400">Monthly</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="p-8 bg-gradient-to-b from-white to-slate-50/50">
                        <div className="flex items-end justify-between h-64 gap-2 md:gap-4 p-4">
                            {[40, 65, 45, 90, 75, 120, 105, 140, 130, 160, 180, 210].map((h, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        style={{ height: `${(h / 210) * 100}%` }}
                                        className={`w-full rounded-t-lg transition-all duration-700 ${i === 11 ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'}`}
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-md transition-opacity whitespace-nowrap shadow-xl z-20 font-bold tracking-wider">
                                            ₦{(h * 5000).toLocaleString()}
                                        </div>
                                    </div>
                                    {i % 2 === 0 && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">W{i + 1}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Growth Rate</h3>
                        <p className="text-2xl font-bold text-slate-900">+18.4%</p>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> vs last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Avg Transaction</h3>
                        <p className="text-2xl font-bold text-slate-900">₦8,450</p>
                        <p className="text-xs text-slate-400 font-medium mt-1">Based on 142 orders</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">New Customers</h3>
                        <p className="text-2xl font-bold text-slate-900">42</p>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="h-3 w-3" /> 5 more than usual
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                            <Target className="h-6 w-6" />
                        </div>
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Target Achievement</h3>
                        <p className="text-2xl font-bold text-slate-900">72%</p>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-orange-500 w-[72%] rounded-full"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Top Revenue Sources</CardTitle>
                        <CardDescription>Most profitable channels and products</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: "POS Sales", value: "₦850,400", share: 65, color: "bg-primary" },
                            { name: "Direct Transfers", value: "₦320,000", share: 24, color: "bg-blue-500" },
                            { name: "Online Store", value: "₦145,200", share: 11, color: "bg-purple-500" },
                        ].map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{source.name}</h4>
                                        <p className="text-xs text-slate-500">{source.share}% of total revenue</p>
                                    </div>
                                    <span className="font-bold text-sm text-slate-900">{source.value}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${source.color} rounded-full`} style={{ width: `${source.share}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
                    <CardContent className="p-8 relative z-10 h-full flex flex-col">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Zap className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Optimize Pricing with AI</h3>
                        <p className="text-white/60 mb-8 leading-relaxed max-w-sm">
                            Our AI detected that your competitor's prices for "Electronics" category are 5% higher. You can increase your margin without losing customers.
                        </p>
                        <div className="mt-auto">
                            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8">
                                Run Price Simulation
                            </Button>
                        </div>
                    </CardContent>
                    {/* Abstract background graphics */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
                </Card>
            </div>
        </div>
    );
}
