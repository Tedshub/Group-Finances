// resources/js/Pages/Auth/Login.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowRight, Lock, Users, ShieldCheck, Wallet, PiggyBank, Zap } from 'lucide-react';
import Logo from '@/Layouts/Logo';

export default function Login({ status, canResetPassword }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Auto reload satu kali saat halaman pertama kali dibuka
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('loginPageReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('loginPageReloaded', 'true');
            window.location.reload();
        } else {
            setIsVisible(true);
        }

        return () => {
            sessionStorage.removeItem('loginPageReloaded');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Head title="Masuk - Group Finances" />
            <div className="min-h-screen bg-[#C8F5C8] flex flex-col overflow-x-hidden">
                {/* Header/Logo Neobrutalism */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4 relative z-10">
                    <Logo size="lg" href="/" showBadge={true} hideTextOnMobile={true} />
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">

                    {/* ── Decorative floating elements (mobile & desktop background) ── */}
                    {/* Top-left block */}
                    <div className="absolute top-8 left-4 w-16 h-16 bg-[#7c98ff] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] rotate-12 opacity-60 hidden sm:block" />
                    {/* Top-right block */}
                    <div className="absolute top-12 right-6 w-10 h-10 bg-[#FDBB4E] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] -rotate-6 opacity-70 hidden sm:block" />
                    {/* Bottom-left block */}
                    <div className="absolute bottom-16 left-8 w-12 h-12 bg-[#FF6B7A] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] -rotate-12 opacity-50 hidden sm:block" />
                    {/* Bottom-right block */}
                    <div className="absolute bottom-10 right-10 w-20 h-20 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_#000] rotate-6 opacity-40 hidden sm:block" />
                    {/* Middle-left floating icon chip */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 hidden lg:flex">
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#C8F5C8] border border-black rounded-lg flex items-center justify-center">
                                <ShieldCheck size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Data Aman</span>
                        </div>
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#7c98ff] border border-black rounded-lg flex items-center justify-center">
                                <Users size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Multi User</span>
                        </div>
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#FDBB4E] border border-black rounded-lg flex items-center justify-center">
                                <Wallet size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Kelola Kas</span>
                        </div>
                    </div>

                    {/* Middle-right floating info chips */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 hidden lg:flex">
                        <div className="bg-[#FDBB4E] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <PiggyBank size={14} className="text-black" />
                            <span className="text-black font-black text-xs">Tabungan Grup</span>
                        </div>
                        <div className="bg-[#FF6B7A] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <Zap size={14} className="text-white" />
                            <span className="text-white font-black text-xs">Realtime Sync</span>
                        </div>
                        <div className="bg-[#7c98ff] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <Lock size={14} className="text-black" />
                            <span className="text-black font-black text-xs">Privasi Terjaga</span>
                        </div>
                    </div>

                    {/* ── Form Card ── */}
                    <div className="max-w-md w-full relative z-10">
                        {/* Decorative accent blocks behind card */}
                        <div className="absolute -top-3 -right-3 w-full h-full bg-[#7c98ff] border-2 border-black rounded-3xl" />
                        <div
                            className={`relative bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-7 sm:p-10 transition-all duration-700 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            {/* Lock icon accent */}
                            <div className="w-12 h-12 bg-[#C8F5C8] border-2 border-black rounded-2xl flex items-center justify-center mb-5 shadow-[2px_2px_0px_0px_#000]">
                                <Lock size={22} className="text-black" />
                            </div>

                            {/* Title */}
                            <div className="mb-7">
                                <h2
                                    className="text-3xl sm:text-4xl font-black text-black mb-2 leading-tight"
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Masuk ke Akun
                                </h2>
                                <p className="text-black/70 text-sm font-bold">
                                    Selamat datang kembali! Kelola keuangan bersama grup Anda.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-3.5 bg-[#c5ffbc] border-2 border-black rounded-xl text-sm font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-black text-black uppercase tracking-wider mb-1.5"
                                    >
                                        Alamat Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label
                                            htmlFor="password"
                                            className="block text-xs font-black text-black uppercase tracking-wider"
                                        >
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-xs font-bold text-black/70 hover:text-black underline underline-offset-2 transition-colors"
                                            >
                                                Lupa password?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all pr-12"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 focus:outline-none cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                            tabIndex="-1"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} className="stroke-[2.5]" />
                                            ) : (
                                                <Eye size={18} className="stroke-[2.5]" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 border-2 border-black rounded text-black focus:ring-0 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
                                    />
                                    <label htmlFor="remember" className="ml-2.5 text-xs font-bold text-black cursor-pointer select-none">
                                        Ingat saya di perangkat ini
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-base shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>{processing ? 'Memproses...' : 'Masuk Sekarang'}</span>
                                    {!processing && <ArrowRight size={18} className="stroke-[3]" />}
                                </button>

                                {/* Register Link Footer */}
                                <div className="text-center pt-3 border-t-2 border-black/10">
                                    <p className="text-xs font-bold text-black/70">
                                        Belum punya akun?{' '}
                                        <Link
                                            href={route('register')}
                                            className="font-black text-black underline underline-offset-4 hover:text-[#5B7FF0] transition-colors"
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
