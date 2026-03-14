'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Brain,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Receipt,
    CreditCard,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    CheckCircle2,
    Clock,
    AlertCircle,
    Plus,
    BarChart3,
    PieChart,
    X,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { fetchApi } from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        processedReceipts: 0
    });
    const [recentReceipts, setRecentReceipts] = useState<any[]>([]);

    useEffect(() => {
        async function loadDashboard() {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
    
                if (!session) {
                    router.push('/login');
                    return;
                }
    
                const currentUser = session.user;
                setUser(currentUser);
    
                // Fetch Profile from Java Backend
                const profileData = await fetchApi('/profiles/me');
                setProfile(profileData);
                if (profileData?.whatsapp_number) {
                    setWhatsappNumber(profileData.whatsapp_number.replace('+', ''));
                }
    
                // Fetch Receipts from Java Backend
                const receipts = await fetchApi('/receipts');
                setRecentReceipts(receipts?.slice(0, 5) || []);
    
                // Fetch Expenses from Java Backend
                const expenses = await fetchApi('/expenses');
    
                const totalExp = expenses?.reduce((acc: any, curr: any) => acc + Number(curr.amount), 0) || 0;
    
                setStats({
                    totalRevenue: 1250000, // Placeholder until revenue data exists
                    totalExpenses: totalExp,
                    netProfit: 1250000 - totalExp,
                    processedReceipts: receipts?.filter((r: any) => r.status === 'completed').length || 0
                });
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const getDisplayName = () => {
        if (profile?.full_name) return profile.full_name;
        if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user?.user_metadata?.name) return user.user_metadata.name;
        return 'User';
    };

    const displayName = getDisplayName();
    const firstName = displayName.split(' ')[0] || 'User';

    const [isConnectingWhatsapp, setIsConnectingWhatsapp] = useState(false);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState("234");
    const [cashFlowPeriod, setCashFlowPeriod] = useState<'7D' | '30D'>('7D');

    const cashFlow7D = {
        data: [35, 45, 30, 60, 50, 80, 70],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };
    const cashFlow30D = {
        data: [30, 40, 55, 35, 65, 48, 72, 60, 85, 78, 90, 70, 55, 80, 65, 95, 88, 72, 60, 78, 85, 70, 65, 92, 80, 74, 68, 85, 90, 75],
        labels: Array.from({ length: 30 }, (_, i) => i % 7 === 0 ? `W${Math.floor(i/7)+1}` : '')
    };
    const activeCashFlow = cashFlowPeriod === '7D' ? cashFlow7D : cashFlow30D;

    const handleConnectWhatsapp = () => {
        setShowWhatsappModal(true);
    };

    const handleFinalizeWhatsapp = async () => {
        if (!whatsappNumber || whatsappNumber.length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }

        setIsConnectingWhatsapp(true);
        
        try {
            const formattedNumber = whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`;
            await fetchApi('/profiles/me', {
                method: 'PUT',
                body: JSON.stringify({ whatsapp_number: formattedNumber })
            });

            // Update local profile state safely
            setProfile((prev: any) => ({ ...prev, whatsapp_number: formattedNumber }));
            setShowWhatsappModal(false);

            setTimeout(() => {
                const copilotBotNumber = '2348000000000'; 
                window.open(`https://wa.me/${copilotBotNumber}?text=Hello%20OpsCopilot!%20Please%20activate%20my%20daily%20AI%20insights%20for%20number%20${formattedNumber}.`, '_blank');
                setIsConnectingWhatsapp(false);
            }, 600);
        } catch (err: any) {
            alert(`Error connecting WhatsApp: ${err.message}`);
            setIsConnectingWhatsapp(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <div className="bg-primary rounded-2xl p-4 animate-bounce mb-4">
                    <Brain className="h-10 w-10 text-white" />
                </div>
                <p className="text-slate-500 font-medium animate-pulse">Analyzing your business data...</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Hello, {firstName}! 👋
                    </h1>
                    <p className="text-slate-500">
                        Here's what's happening with <span className="font-semibold">{profile?.business_name || 'your business'}</span> today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/onboarding/upload-data">
                        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> Upload Data
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-none shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold">
                                <ArrowUpRight className="h-3 w-3" /> 12.5%
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Revenue</h3>
                        <div className="text-2xl font-bold text-slate-900">₦{stats.totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold">
                                <ArrowDownRight className="h-3 w-3" /> 4.2%
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Expenses</h3>
                        <div className="text-2xl font-bold text-slate-900">₦{stats.totalExpenses.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                Healthy
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Net Profit</h3>
                        <div className="text-2xl font-bold text-slate-900">₦{stats.netProfit.toLocaleString()}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">
                                AI Active
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Processed Files</h3>
                        <div className="text-2xl font-bold text-slate-900">{stats.processedReceipts} <span className="text-lg font-medium text-slate-400">files</span></div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Charts area */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Cash Flow History</CardTitle>
                                    <CardDescription>Visual trend of your revenue vs expenses</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-lg border">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 text-xs font-bold transition-all ${
                                            cashFlowPeriod === '7D'
                                                ? 'bg-white shadow-sm border text-slate-900'
                                                : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                        onClick={() => setCashFlowPeriod('7D')}
                                    >7D</Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`h-7 text-xs font-bold transition-all ${
                                            cashFlowPeriod === '30D'
                                                ? 'bg-white shadow-sm border text-slate-900'
                                                : 'text-slate-400 hover:text-slate-700'
                                        }`}
                                        onClick={() => setCashFlowPeriod('30D')}
                                    >30D</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full bg-slate-50 flex items-end justify-between p-4 rounded-xl gap-1 border border-slate-100 overflow-hidden">
                                {activeCashFlow.data.map((h, i) => (
                                    <div key={`${cashFlowPeriod}-${i}`} className="flex-1 space-y-1" style={{ minWidth: cashFlowPeriod === '30D' ? 0 : undefined }}>
                                        <div className="flex items-end gap-0.5 h-48 group">
                                            <div
                                                style={{ height: `${h}%` }}
                                                className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/50 transition-all duration-500"
                                            ></div>
                                            <div
                                                style={{ height: `${Math.max(h - 15, 5)}%` }}
                                                className="w-full bg-red-400/20 rounded-t-lg group-hover:bg-red-400/40 transition-all duration-500"
                                            ></div>
                                        </div>
                                        <div className="text-[9px] text-center text-slate-400 font-bold truncate">{activeCashFlow.labels[i]}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-primary rounded-full"></span>
                                    <span className="text-xs text-slate-500 font-medium">Revenue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 bg-red-400 rounded-full"></span>
                                    <span className="text-xs text-slate-500 font-medium">Expenses</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Documents</CardTitle>
                            <CardDescription>Status of your recently uploaded invoices and statements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentReceipts.length > 0 ? (
                                    recentReceipts.map((receipt, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 truncate max-w-[150px]">{receipt.file_name}</h4>
                                                    <p className="text-xs text-slate-500">{new Date(receipt.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {receipt.status === 'completed' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                                                        <CheckCircle2 className="h-3 w-3" /> Processed
                                                    </div>
                                                ) : receipt.status === 'pending' ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold italic">
                                                        <Clock className="h-3 w-3 animate-spin" /> Analyzing
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">
                                                        <AlertCircle className="h-3 w-3" /> Error
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-slate-50/50">
                                        <div className="bg-slate-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileText className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 mb-1">No documents yet</h4>
                                        <p className="text-sm text-slate-500 mb-4">Upload your data to see AI insights here.</p>
                                        <Link href="/onboarding/upload-data">
                                            <Button variant="outline" size="sm">Upload Now</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* AI Insights & Alerts */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 bg-primary rounded-md">
                                    <Brain className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg">AI Insights</CardTitle>
                            </div>
                            <CardDescription className="text-slate-600">Smart analysis of your operations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <AlertCircle className="h-12 w-12" />
                                </div>
                                <h5 className="font-bold text-sm text-slate-900 mb-1">High Marketing Spend</h5>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                    Your marketing expenses are 15% higher than last month. Consider reviewing your Facebook Ad performance.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-primary uppercase">Critical</span>
                                    <Link href="/dashboard/expenses">
                                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:bg-primary/10 p-0 font-bold underline">View Details</Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl shadow-sm border border-primary/5 relative overflow-hidden group">
                                <h5 className="font-bold text-sm text-slate-900 mb-1">Growth Opportunity</h5>
                                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                    Sales in "Fashion" category are peaking on Saturdays. Run a weekend promo to maximize profit.
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-green-600 uppercase">Tip</span>
                                    <Link href="/dashboard/ai-insights">
                                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:bg-primary/10 p-0 font-bold underline">Apply strategy</Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Health */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary" />
                                Business Health
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-600">CASH RUNWAY</span>
                                    <span className="text-green-600">9 MONTHS</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[75%] rounded-full"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-slate-600">INVENTORY TURNOVER</span>
                                    <span className="text-blue-600">GOOD</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <div className="p-4 bg-indigo-900 rounded-2xl text-white relative overflow-hidden group">
                                    <div className="relative z-10">
                                        <h4 className="font-bold text-sm mb-1">WhatsApp Alerts</h4>
                                        <p className="text-[10px] opacity-80 mb-3">
                                            {profile?.whatsapp_number 
                                                ? `Connected to ${profile.whatsapp_number}` 
                                                : 'Get daily summaries and alerts via WhatsApp.'}
                                        </p>
                                        <Button
                                            size="sm"
                                            className="bg-white text-indigo-900 hover:bg-white/90 h-8 font-bold text-[10px] px-4 rounded-xl transition-all disabled:opacity-50"
                                            onClick={handleConnectWhatsapp}
                                            disabled={isConnectingWhatsapp}
                                        >
                                            {isConnectingWhatsapp ? 'Connecting...' : profile?.whatsapp_number ? 'Update WhatsApp' : 'Connect WhatsApp'}
                                        </Button>
                                    </div>
                                    <div className="absolute top-[-20px] right-[-20px] h-24 w-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* WhatsApp Custom Modal */}
            {showWhatsappModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <CardHeader className="bg-slate-900 text-white relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-4 text-white/50 hover:text-white hover:bg-white/10"
                                onClick={() => setShowWhatsappModal(false)}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                            <div className="h-12 w-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                                <MessageSquare className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-xl">Connect WhatsApp</CardTitle>
                            <CardDescription className="text-slate-400">
                                Receive automated business insights
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                                <strong>How it works:</strong> OpsCopilot acts as your 24/7 AI manager. By connecting your number, the AI will automatically message you when it detects opportunities, risks, or overdue tasks based on your live data.
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your WhatsApp Number</label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="e.g. 2348012345678"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        className="h-12 pl-4 text-lg font-medium border-slate-200 focus:ring-primary/20 focus:border-primary"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400">Include country code (e.g., 234 for Nigeria) without the '+' sign.</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-lg shadow-primary/20"
                                    onClick={handleFinalizeWhatsapp}
                                    disabled={isConnectingWhatsapp || !whatsappNumber}
                                >
                                    {isConnectingWhatsapp ? 'Saving...' : 'Connect & Message Bot'}
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full h-12 text-slate-500 font-bold text-sm"
                                    onClick={() => setShowWhatsappModal(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    );
}

function FileText(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </svg>
    )
}
