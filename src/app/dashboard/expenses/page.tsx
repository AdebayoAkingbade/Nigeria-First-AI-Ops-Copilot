'use client'

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    CreditCard,
    Calendar,
    Receipt,
    ChevronDown,
    MoreHorizontal,
    Download,
    FileText,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function ExpensesPage() {
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        async function fetchExpenses() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', session.user.id)
                .order('transaction_date', { ascending: false });

            setExpenses(data || []);
            setTotalExpenses(data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0);
            setLoading(false);
        }
        fetchExpenses();
    }, []);

    const categories = [
        { name: "Marketing", spent: 45000, color: "bg-blue-500" },
        { name: "Inventory", spent: 125000, color: "bg-purple-500" },
        { name: "Utilities", spent: 15000, color: "bg-green-500" },
        { name: "Logistics", spent: 22000, color: "bg-orange-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Expenses Analysis</h1>
                    <p className="text-slate-500">Keep track of your spending and identify cost-saving opportunities.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 gap-2">
                        <Plus className="h-4 w-4" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">High</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Spent (MTD)</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₦{totalExpenses.toLocaleString() || '124,500'}</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">AI Ready</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Scanned Receipts</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length || '12'} <span className="text-sm font-medium text-slate-400">documents</span></p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">-12% Saved</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Saving Potential</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-1">₦42,000</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions Table */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="border-b bg-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <CardTitle>Transaction History</CardTitle>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search expenses..."
                                            className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Filter className="h-4 w-4" /> Filter
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Transaction</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {expenses.length > 0 ? (
                                            expenses.map((exp, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                                                <FileText className="h-4 w-4 text-slate-500" />
                                                            </div>
                                                            <span className="font-bold text-sm text-slate-900">{exp.merchant_name || 'Vendor'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                                                            {exp.category || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500">
                                                        {new Date(exp.transaction_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-sm text-slate-900">
                                                        ₦{Number(exp.amount).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Receipt className="h-10 w-10 text-slate-300 mb-2" />
                                                        <p className="text-slate-500 font-medium italic">No expenses recorded yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Area */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Spending by Category</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {categories.map((cat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-600">{cat.name.toUpperCase()}</span>
                                        <span className="text-slate-900">₦{cat.spent.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${(cat.spent / 200000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full text-xs font-bold py-6 border-dashed border-2 hover:border-primary hover:text-primary transition-all">
                                Analyze All Categories
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                        <CardContent className="p-6 relative z-10">
                            <h4 className="font-bold text-lg mb-2">Automate Expenses</h4>
                            <p className="text-white/80 text-xs mb-6 leading-relaxed">
                                Connect your bank account to automatically import and categorize every transaction with 99% accuracy.
                            </p>
                            <Button className="w-full bg-white text-indigo-700 hover:bg-white/90 font-bold transition-transform hover:scale-105">
                                Connect Bank Now
                            </Button>
                        </CardContent>
                        {/* Decorative circles */}
                        <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-[-40px] left-[-20px] h-48 w-48 bg-white/5 rounded-full blur-2xl"></div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
