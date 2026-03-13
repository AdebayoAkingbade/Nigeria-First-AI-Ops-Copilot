'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Brain,
    Sparkles,
    AlertCircle,
    Zap,
    TrendingUp,
    Target,
    ShieldCheck,
    MessageSquare,
    ArrowRight,
    X,
    CheckCircle2,
    Upload,
    RefreshCw,
    Settings,
    Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

const insightTemplates = [
    {
        type: "Critical",
        title: "Overstock Warning: Nike Sneakers",
        description: "Based on current sales velocity, your current stock will last 8 months. Capital is being tied up unproductively.",
        action: "Run Clearance Sale",
        impact: "₦145,000 cash recovery",
        color: "text-red-600 bg-red-50 border-red-100",
        icon: <AlertCircle className="h-5 w-5" />,
        fix: "Mark Nike Sneakers down by 15% for 2 weeks to accelerate sell-through and recover ₦145,000 in tied-up inventory capital."
    },
    {
        type: "Opportunity",
        title: "Weekend Demand Spike",
        description: "Data shows a 45% increase in orders for 'Accessories' during Saturdays between 11 AM - 3 PM.",
        action: "Add 1 Temporary Staff",
        impact: "Reduce wait time by 20%",
        color: "text-blue-600 bg-blue-50 border-blue-100",
        icon: <Sparkles className="h-5 w-5" />,
        fix: "Schedule one part-time staff member for Saturday 10 AM - 4 PM. Estimated cost: ₦5,000. Estimated revenue gain: ₦40,000/month."
    },
    {
        type: "Efficiency",
        title: "Optimize Vendor Deliveries",
        description: "Ahmad Logistics has been late 4 times this month. Switching to reliable partners could save business hours.",
        action: "Review Contract",
        impact: "12 hours saved/month",
        color: "text-purple-600 bg-purple-50 border-purple-100",
        icon: <Zap className="h-5 w-5" />,
        fix: "Contact Ahmad Logistics and request SLA penalties for delays. Alternatively, switch 30% of orders to Kwik Delivery who has a 97% on-time rate."
    }
];

export default function AIInsightsPage() {
    const router = useRouter();

    // State
    const [insights, setInsights] = useState(insightTemplates);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('Just now');
    const [appliedInsights, setAppliedInsights] = useState<Set<number>>(new Set());

    // Modal states
    const [showWhatsapp, setShowWhatsapp] = useState(false);
    const [showApplyFix, setShowApplyFix] = useState<number | null>(null);
    const [showDataSources, setShowDataSources] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);

    // WhatsApp state
    const [whatsappNumber, setWhatsappNumber] = useState('234');
    const [savingWhatsapp, setSavingWhatsapp] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    // Settings toggles
    const [emailSummaries, setEmailSummaries] = useState(false);
    const [whatsappAlerts, setWhatsappAlerts] = useState(true);

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
            if (data) {
                setProfile(data);
                if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number.replace('+', ''));
                if (data.whatsapp_number) setWhatsappAlerts(true);
            }
        }
        loadProfile();
    }, []);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        // Simulate AI re-analysis
        await new Promise(r => setTimeout(r, 2500));
        // Shuffle insights slightly to simulate fresh data
        setInsights([...insightTemplates].sort(() => Math.random() - 0.5));
        setAppliedInsights(new Set());
        setLastUpdated(new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }));
        setIsRegenerating(false);
    };

    const handleSaveWhatsapp = async () => {
        if (!whatsappNumber || whatsappNumber.length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }
        setSavingWhatsapp(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setSavingWhatsapp(false); return; }

        const formatted = whatsappNumber.startsWith('+') ? whatsappNumber : `+${whatsappNumber}`;
        const { error } = await supabase.from('profiles').update({ whatsapp_number: formatted }).eq('id', session.user.id);
        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            setShowWhatsapp(false);
            window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hello%20OpsCopilot!%20I'd%20like%20to%20receive%20daily%20insights.`, '_blank');
        }
        setSavingWhatsapp(false);
    };

    const handleApplyFix = (i: number) => {
        setAppliedInsights(prev => new Set([...prev, i]));
        setShowApplyFix(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Hero Header */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-primary mb-4 border border-white/10 backdrop-blur-md">
                            <Brain className="h-3 w-3" /> AI Engine Active · Updated {lastUpdated}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                            Smart insights for <span className="text-primary italic">smarter</span> decisions.
                        </h1>
                        <p className="text-white/60 text-lg leading-relaxed mb-8">
                            We've analyzed your latest uploads and identified {insights.length} key actions to take this week.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                className="bg-primary hover:bg-primary/90 text-white h-12 px-8 font-bold gap-2 disabled:opacity-70"
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                            >
                                <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                                {isRegenerating ? 'Analyzing...' : 'Regenerate Analysis'}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 border-white/20 hover:bg-white/10 hover:text-white text-white gap-2"
                                onClick={() => setShowWhatsapp(true)}
                            >
                                <MessageSquare className="h-4 w-4" />
                                {profile?.whatsapp_number ? 'Update WhatsApp' : 'Connect WhatsApp'}
                            </Button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="h-64 w-64 bg-primary/20 rounded-full absolute -top-10 -right-10 blur-[80px]"></div>
                        <div className="h-48 w-48 border-2 border-white/10 rounded-3xl rotate-12 flex items-center justify-center backdrop-blur-sm relative">
                            <Brain className={`h-24 w-24 text-primary ${isRegenerating ? 'animate-pulse' : ''}`} />
                        </div>
                    </div>
                </div>
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
                        <Button variant="ghost" size="sm" className="text-slate-400 font-bold hover:text-slate-900">Archive All</Button>
                    </div>

                    {isRegenerating ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="border-none shadow-sm">
                                    <CardContent className="p-6">
                                        <div className="animate-pulse space-y-3">
                                            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                                            <div className="h-3 bg-slate-100 rounded w-full"></div>
                                            <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        insights.map((insight, i) => (
                            <Card key={i} className={`border-none shadow-sm hover:shadow-md transition-all duration-300 group border-l-4 overflow-hidden ${appliedInsights.has(i) ? 'border-l-green-500 opacity-70' : 'border-l-transparent hover:border-l-primary'}`}>
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
                                            {appliedInsights.has(i) ? (
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                                                    <CheckCircle2 className="h-4 w-4" /> Applied
                                                </span>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-900">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{insight.description}</p>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t font-bold">
                                            <div className="flex-1 text-xs text-slate-400">
                                                SUGGESTED ACTION: <span className="text-slate-900 ml-1">{insight.action}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                                                <TrendingUp className="h-3 w-3" /> {insight.impact}
                                            </div>
                                            <Button
                                                className={`h-9 px-6 rounded-lg ${appliedInsights.has(i) ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                                                onClick={() => !appliedInsights.has(i) && setShowApplyFix(i)}
                                                disabled={appliedInsights.has(i)}
                                            >
                                                {appliedInsights.has(i) ? 'Applied ✓' : 'Apply Fix'}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Insight Settings */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Insight Settings</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-primary"
                                    onClick={() => setShowSettings(true)}
                                >
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <label
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => setEmailSummaries(!emailSummaries)}
                                >
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">Email Summaries</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">Get insights in your inbox daily</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full relative transition-colors duration-300 ${emailSummaries ? 'bg-primary' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
                                        <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${emailSummaries ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                </label>
                                <label
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                                >
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">WhatsApp Alerts</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">Instant alerts on critical issues</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full relative transition-colors duration-300 ${whatsappAlerts ? 'bg-primary' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
                                        <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${whatsappAlerts ? 'left-[22px]' : 'left-0.5'}`}></div>
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

                    {/* Data Reliability */}
                    <Card className="border-none shadow-sm overflow-hidden group">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                Data Reliability
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                Our AI is currently analyzing data from <strong>2 bank accounts</strong> and <strong>4 document types</strong>. Increase accuracy by uploading more historical data.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full h-11 border-dashed font-bold hover:bg-slate-50 group-hover:border-primary group-hover:text-primary transition-all"
                                onClick={() => setShowDataSources(true)}
                            >
                                Add more data sources
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upgrade Plan */}
                    <div
                        className="p-6 bg-primary text-white rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col items-center text-center cursor-pointer hover:shadow-2xl hover:shadow-primary/30 transition-all"
                    >
                        <div className="relative z-10">
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-md">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h4 className="text-xl font-bold mb-2 uppercase tracking-tighter">Scale with Confidence</h4>
                            <p className="text-white/70 text-sm mb-6 max-w-[200px] mx-auto">
                                Let AI manage your daily operations while you focus on vision.
                            </p>
                            <Button
                                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold h-11"
                                onClick={() => setShowUpgrade(true)}
                            >
                                Upgrade Plan
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 h-32 w-32 bg-white/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* ─── WhatsApp Modal ─── */}
            {showWhatsapp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="bg-slate-900 text-white rounded-t-xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/30 rounded-xl flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-white">Connect WhatsApp</CardTitle>
                                        <CardDescription className="text-slate-400">Get daily AI insights on WhatsApp</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10" onClick={() => setShowWhatsapp(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Phone Number</label>
                                <Input
                                    type="text"
                                    placeholder="e.g. 2348012345678"
                                    value={whatsappNumber}
                                    onChange={e => setWhatsappNumber(e.target.value)}
                                    className="h-12 text-lg font-medium"
                                />
                                <p className="text-[10px] text-slate-400">Include country code (e.g., 234 for Nigeria) without the '+' sign.</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowWhatsapp(false)}>Cancel</Button>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    onClick={handleSaveWhatsapp}
                                    disabled={savingWhatsapp}
                                >
                                    {savingWhatsapp ? 'Saving...' : 'Continue to WhatsApp'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Apply Fix Modal ─── */}
            {showApplyFix !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Apply Fix</CardTitle>
                                    <CardDescription>{insights[showApplyFix]?.title}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowApplyFix(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Recommendation</h5>
                                <p className="text-sm text-slate-700 leading-relaxed">{insights[showApplyFix]?.fix}</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                                <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                                <p className="text-sm font-bold text-green-800">Expected impact: {insights[showApplyFix]?.impact}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowApplyFix(null)}>Cancel</Button>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    onClick={() => handleApplyFix(showApplyFix)}
                                >
                                    Confirm & Apply
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Add Data Sources Modal ─── */}
            {showDataSources && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Upload className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Add Data Sources</CardTitle>
                                        <CardDescription>Improve AI accuracy with more data</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowDataSources(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-sm text-slate-500">Your AI works best with more data. Currently connected:</p>
                            <div className="space-y-2">
                                {['Bank Statements (2 accounts)', 'Sales Receipts (47 files)', 'Expense Reports (12 files)', 'Inventory Data (1 file)'].map((source, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                        <span className="text-sm font-medium text-slate-700">{source}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-2 border-dashed rounded-xl text-center">
                                <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-500 mb-1">Upload more files to improve insights</p>
                                <p className="text-[10px] text-slate-400">Supports PDF, Excel, CSV, Images</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setShowDataSources(false)}>Cancel</Button>
                                <Button
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                    onClick={() => { setShowDataSources(false); router.push('/onboarding/upload-data'); }}
                                >
                                    Upload Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Insight Settings Modal ─── */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Insight Settings</CardTitle>
                                    <CardDescription>Customize how you receive AI insights</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {[
                                { label: 'Email Summaries', desc: 'Daily digest in your inbox at 8 AM', state: emailSummaries, toggle: () => setEmailSummaries(!emailSummaries) },
                                { label: 'WhatsApp Alerts', desc: 'Instant alerts on critical issues', state: whatsappAlerts, toggle: () => setWhatsappAlerts(!whatsappAlerts) },
                            ].map((setting, i) => (
                                <label key={i} className="flex items-center justify-between cursor-pointer" onClick={setting.toggle}>
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-900">{setting.label}</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">{setting.desc}</p>
                                    </div>
                                    <div className={`h-6 w-11 rounded-full relative transition-colors duration-300 ${setting.state ? 'bg-primary' : 'bg-slate-200'}`}>
                                        <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${setting.state ? 'left-[22px]' : 'left-0.5'}`}></div>
                                    </div>
                                </label>
                            ))}
                            <div className="pt-4 border-t">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Alert Frequency</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Instant', 'Daily', 'Weekly'].map(freq => (
                                        <button key={freq} className="p-2 border rounded-lg text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all first:border-primary first:text-primary first:bg-primary/5">
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setShowSettings(false)}>
                                Save Settings
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ─── Upgrade Plan Modal ─── */}
            {showUpgrade && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl border-none shadow-2xl animate-in zoom-in-95 duration-200">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="h-5 w-5 text-yellow-500" /> Upgrade Your Plan
                                    </CardTitle>
                                    <CardDescription>Unlock advanced AI capabilities for your business</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setShowUpgrade(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Starter Plan */}
                                <div className="p-6 border-2 rounded-2xl space-y-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg">Starter</h4>
                                        <p className="text-slate-500 text-xs">You're currently here</p>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">₦0 <span className="text-base font-medium text-slate-400">/mo</span></div>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {['3 AI insights per day', 'Basic expense tracking', '1 user account', '30-day data history'].map((f, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                                </div>

                                {/* Pro Plan */}
                                <div className="p-6 border-2 border-primary rounded-2xl space-y-4 relative bg-primary/5">
                                    <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
                                    <div>
                                        <h4 className="font-bold text-primary text-lg">Pro</h4>
                                        <p className="text-slate-500 text-xs">For serious business owners</p>
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900">₦15,000 <span className="text-base font-medium text-slate-400">/mo</span></div>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        {['Unlimited AI insights', 'Bank account sync', 'Multi-user (up to 5)', '1-year data history', 'WhatsApp + Email alerts', 'Priority support'].map((f, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="w-full bg-primary hover:bg-primary/90">Get Pro →</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
