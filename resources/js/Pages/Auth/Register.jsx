// resources/js/Pages/Auth/Register.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X, ArrowRight, UserPlus, Users, PiggyBank, BarChart3, ShieldCheck, Sparkles, Home } from 'lucide-react';
import Logo from '@/Layouts/Logo';

export default function Register() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
    const [passwordMatch, setPasswordMatch] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Auto reload satu kali saat halaman pertama kali dibuka
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('registerPageReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('registerPageReloaded', 'true');
            window.location.reload();
        } else {
            setIsVisible(true);
        }

        return () => {
            sessionStorage.removeItem('registerPageReloaded');
        };
    }, []);

    // Validasi password real-time
    useEffect(() => {
        const validations = {
            minLength: data.password.length >= 8,
            hasUpperCase: /[A-Z]/.test(data.password),
            hasLowerCase: /[a-z]/.test(data.password),
            hasNumber: /[0-9]/.test(data.password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)
        };
        setPasswordValidation(validations);
    }, [data.password]);

    // Cek kecocokan password confirmation
    useEffect(() => {
        if (data.password_confirmation === '') {
            setPasswordMatch(null);
        } else if (data.password === data.password_confirmation && data.password !== '') {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    }, [data.password, data.password_confirmation]);

    const submit = (e) => {
        e.preventDefault();

        const isValidPassword = Object.values(passwordValidation).every(Boolean);

        if (!isValidPassword) {
            alert('Password harus memenuhi semua persyaratan keamanan');
            return;
        }

        if (!passwordMatch) {
            alert('Konfirmasi password tidak cocok');
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);

    return (
        <>
            <Head title="Daftar Akun - Group Finances" />
            <div className="min-h-screen bg-[#C8F5C8] flex flex-col overflow-x-hidden">
                {/* Header/Logo Neobrutalism */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4 relative z-10">
                    <Logo size="lg" href="/" showBadge={true} hideTextOnMobile={true} />
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">

                    {/* ── Decorative floating shapes in background ── */}
                    <div className="absolute top-6 left-4 w-14 h-14 bg-[#FDBB4E] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] -rotate-6 opacity-60 hidden sm:block" />
                    <div className="absolute top-16 right-8 w-10 h-10 bg-[#7c98ff] border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_#000] rotate-12 opacity-70 hidden sm:block" />
                    <div className="absolute bottom-20 left-6 w-16 h-16 bg-white border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_#000] rotate-6 opacity-40 hidden sm:block" />
                    <div className="absolute bottom-8 right-4 w-12 h-12 bg-[#FF6B7A] border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_#000] -rotate-12 opacity-50 hidden sm:block" />
                    {/* Extra smaller shapes */}
                    <div className="absolute top-1/3 left-16 w-6 h-6 bg-[#C8F5C8] border-2 border-black rounded-lg rotate-45 opacity-80 hidden xl:block" />
                    <div className="absolute bottom-1/3 right-16 w-8 h-8 bg-[#FDBB4E] border-2 border-black rounded-lg -rotate-12 opacity-60 hidden xl:block" />

                    {/* Middle-left floating icon chips */}
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-3 hidden lg:flex">
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#FDBB4E] border border-black rounded-lg flex items-center justify-center">
                                <Users size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Kelola Grup</span>
                        </div>
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#C8F5C8] border border-black rounded-lg flex items-center justify-center">
                                <PiggyBank size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Tabungan Bersama</span>
                        </div>
                        <div className="bg-white border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <div className="w-7 h-7 bg-[#FF6B7A] border border-black rounded-lg flex items-center justify-center">
                                <Home size={14} className="text-black" />
                            </div>
                            <span className="text-black font-black text-xs">Kas Keluarga</span>
                        </div>
                    </div>

                    {/* Middle-right floating info chips */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-3 hidden lg:flex">
                        <div className="bg-[#7c98ff] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <BarChart3 size={14} className="text-black" />
                            <span className="text-black font-black text-xs">Laporan Otomatis</span>
                        </div>
                        <div className="bg-[#C8F5C8] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <ShieldCheck size={14} className="text-black" />
                            <span className="text-black font-black text-xs">100% Aman</span>
                        </div>
                        <div className="bg-[#FDBB4E] border-2 border-black rounded-2xl px-3 py-2.5 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
                            <Sparkles size={14} className="text-black" />
                            <span className="text-black font-black text-xs">Gratis Selamanya</span>
                        </div>
                    </div>

                    {/* ── Form Card ── */}
                    <div className="max-w-md w-full relative z-10">
                        {/* Accent block behind card */}
                        <div className="absolute -top-3 -right-3 w-full h-full bg-[#FDBB4E] border-2 border-black rounded-3xl" />
                        <div
                            className={`relative bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-7 sm:p-10 transition-all duration-700 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            {/* UserPlus icon accent */}
                            <div className="w-12 h-12 bg-[#FDBB4E] border-2 border-black rounded-2xl flex items-center justify-center mb-5 shadow-[2px_2px_0px_0px_#000]">
                                <UserPlus size={22} className="text-black" />
                            </div>
                            {/* Title */}
                            <div className="mb-7">
                                <h2
                                    className="text-3xl sm:text-4xl font-black text-black mb-2 leading-tight"
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Daftar Akun Baru
                                </h2>
                                <p className="text-black/70 text-sm font-bold">
                                    Mulai kelola keuangan bersama keluarga, pasangan, atau tim Anda.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-xs font-black text-black uppercase tracking-wider mb-1.5"
                                    >
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama lengkap Anda"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.name}</p>
                                    )}
                                </div>

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
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-black text-black uppercase tracking-wider mb-1.5"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all pr-12"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
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

                                    {/* Password Validation Checklist (Neobrutalism Box) */}
                                    <div className="mt-2.5 p-3 bg-gray-50 border-2 border-black rounded-xl space-y-1.5 shadow-[2px_2px_0px_0px_#000]">
                                        <p className="text-[10px] font-black text-black/60 uppercase tracking-wider mb-1">Syarat Keamanan Password:</p>
                                        {[
                                            { valid: passwordValidation.minLength, label: "Minimal 8 karakter" },
                                            { valid: passwordValidation.hasUpperCase, label: "Mengandung huruf besar (A-Z)" },
                                            { valid: passwordValidation.hasLowerCase, label: "Mengandung huruf kecil (a-z)" },
                                            { valid: passwordValidation.hasNumber, label: "Mengandung angka (0-9)" },
                                            { valid: passwordValidation.hasSpecialChar, label: "Mengandung simbol (!@#$%^&*)" },
                                        ].map((rule, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <span
                                                    className={`w-4 h-4 rounded-full border border-black flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                                                        rule.valid
                                                            ? 'bg-[#c5ffbc] text-black'
                                                            : 'bg-white text-black/30'
                                                    }`}
                                                >
                                                    {rule.valid ? <Check size={10} className="stroke-[3]" /> : "•"}
                                                </span>
                                                <span className={`text-xs font-bold ${rule.valid ? 'text-black' : 'text-black/50'}`}>
                                                    {rule.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-xs font-black text-black uppercase tracking-wider mb-1.5"
                                    >
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className={`w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none transition-all pr-12 ${
                                                passwordMatch === null
                                                    ? 'focus:shadow-[3px_3px_0px_0px_#000]'
                                                    : passwordMatch
                                                    ? 'bg-[#c5ffbc]/30 focus:shadow-[3px_3px_0px_0px_#000]'
                                                    : 'bg-[#FF6B7A]/20 focus:shadow-[3px_3px_0px_0px_#000]'
                                            }`}
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password Anda"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 focus:outline-none cursor-pointer"
                                            onClick={toggleConfirmPasswordVisibility}
                                            tabIndex="-1"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} className="stroke-[2.5]" />
                                            ) : (
                                                <Eye size={18} className="stroke-[2.5]" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {passwordMatch !== null && (
                                        <div className="mt-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full border border-black shadow-[1px_1px_0px_0px_#000] ${
                                                    passwordMatch
                                                        ? 'bg-[#c5ffbc] text-black'
                                                        : 'bg-[#FF6B7A] text-white'
                                                }`}
                                            >
                                                {passwordMatch ? (
                                                    <>
                                                        <Check size={12} className="stroke-[3]" />
                                                        <span>Password cocok</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={12} className="stroke-[3]" />
                                                        <span>Password belum cocok</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {errors.password_confirmation && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing || !isPasswordValid || !passwordMatch}
                                    className="w-full py-3.5 px-6 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-base shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-5"
                                >
                                    <span>{processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
                                    {!processing && <ArrowRight size={18} className="stroke-[3]" />}
                                </button>

                                {/* Login Link Footer */}
                                <div className="text-center pt-3 border-t-2 border-black/10">
                                    <p className="text-xs font-bold text-black/70">
                                        Sudah punya akun?{' '}
                                        <Link
                                            href={route('login')}
                                            className="font-black text-black underline underline-offset-4 hover:text-[#5B7FF0] transition-colors"
                                        >
                                            Masuk di Sini
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
