'use client';

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-12 z-10 text-center"
            >
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 mx-auto mb-8">
                    <Activity className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">BoostFlow OS</h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Premium Social Media Management</p>

                <div className="space-y-4">
                    <button
                        onClick={() => signIn("google")}
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 hover:border-slate-300 transition-all font-black text-slate-700 shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        ลงชื่อเข้าใช้ด้วย Google
                    </button>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-300 uppercase tracking-widest">
                        <Globe className="w-3.5 h-3.5" />
                        Trusted by Experts
                    </div>
                </div>
            </motion.div>

            <p className="mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] z-10">
                SocialBoost Dashboard © 2026
            </p>
        </div>
    );
}
