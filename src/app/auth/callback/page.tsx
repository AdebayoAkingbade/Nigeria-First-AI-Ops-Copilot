'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function handleCallback() {
            try {
                // 1) Code flow (?code=) – standard for email confirmations
                const code = searchParams.get("code");
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                } else {
                    // 2) Hash flow (#access_token=) – fallback for other link styles
                    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
                    if (hash) {
                        const params = new URLSearchParams(hash);
                        const access_token = params.get("access_token");
                        const refresh_token = params.get("refresh_token");
                        if (access_token && refresh_token) {
                            const { error } = await supabase.auth.setSession({
                                access_token,
                                refresh_token,
                            });
                            if (error) throw error;
                        }
                    }
                }

                const next = (typeof window !== "undefined" && localStorage.getItem("postAuthRedirect")) || "/dashboard";
                router.replace(next);
            } catch (err: any) {
                setError(err.message || "Failed to complete sign-in");
            }
        }
        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            <div className="space-y-3 text-center">
                <p className="text-lg font-semibold">Completing sign-in…</p>
                <p className="text-sm text-muted-foreground">Hang tight, we’re securing your session.</p>
                {error && (
                    <div className="mt-2 text-sm text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
