'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    Brain,
    Bell,
    LogOut,
    LayoutDashboard,
    CreditCard,
    TrendingUp,
    Sparkles,
    Search,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function getSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setProfile(profileData);
        }
        getSession();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const navItems = [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
        { label: "Revenue", href: "/dashboard/revenue", icon: TrendingUp },
        { label: "AI Insights", href: "/dashboard/ai-insights", icon: Sparkles },
    ];

    const getDisplayName = () => {
        if (profile?.full_name) return profile.full_name;
        if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
        if (user?.user_metadata?.name) return user.user_metadata.name;
        return 'User';
    };

    const displayName = getDisplayName();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Main Header */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary rounded-lg p-1.5 transition-transform group-hover:scale-110">
                                <Brain className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">OpsCopilot</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${isActive
                                                ? "text-primary bg-primary/5"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                            }`}
                                    >
                                        <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-slate-400"}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden sm:flex items-center relative group">
                            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search insights..."
                                className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-48 focus:w-64 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="relative group">
                            <Bell className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>

                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20 cursor-pointer hover:ring-4 hover:ring-primary/10 transition-all">
                            {displayName.charAt(0)}
                        </div>

                        <Button variant="ghost" size="icon" onClick={handleSignOut} className="hidden sm:flex">
                            <LogOut className="h-5 w-5 text-slate-500 hover:text-red-500 transition-colors" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t bg-white p-4 space-y-2 animate-in slide-in-from-top duration-300">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        <div className="pt-2 border-t mt-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-500 hover:bg-red-50 font-semibold"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 bg-slate-50">
                {children}
            </main>
        </div>
    );
}
