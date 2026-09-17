// resources/js/Pages/Auth/ResetPassword.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';
import Logo from '@/Layouts/Logo';

export default function ResetPassword({ token, email }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // Auto reload satu kali saat halaman pertama kali dibuka
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('resetPasswordPageReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('resetPasswordPageReloaded', 'true');
            window.location.reload();
        } else {
            setIsVisible(true);
        }

        return () => {
            sessionStorage.removeItem('resetPasswordPageReloaded');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reset Password - Group Finances" />
            <div className="min-h-screen bg-[#C8F5C8] flex flex-col overflow-x-hidden">
                {/* Header/Logo Neobrutalism */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                    <Logo size="lg" href="/" showBadge={true} />
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="max-w-md w-full">
                        <div
                            className={`bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_#000] p-7 sm:p-10 transition-all duration-700 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}
                        >
                            {/* Title */}
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full border-2 border-black bg-[#7c98ff] flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_#000]">
                                    <KeyRound size={22} className="text-black stroke-[2.5]" />
                                </div>
                                <h2
                                    className="text-3xl sm:text-4xl font-black text-black mb-2 leading-tight"
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Buat Password Baru
                                </h2>
                                <p className="text-black/70 text-sm font-bold">
                                    Silakan buat kata sandi baru yang aman untuk akun Anda.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
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
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all pr-12"
                                            autoComplete="new-password"
                                            autoFocus
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 focus:outline-none cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
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

                                {/* Confirm Password Field */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-xs font-black text-black uppercase tracking-wider mb-1.5"
                                    >
                                        Konfirmasi Password Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            type={showPasswordConfirmation ? "text" : "password"}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="w-full px-4 py-3 border-2 border-black rounded-xl font-bold text-black placeholder:text-black/35 focus:outline-none focus:shadow-[3px_3px_0px_0px_#000] transition-all pr-12"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password baru"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-700 focus:outline-none cursor-pointer"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            tabIndex="-1"
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff size={18} className="stroke-[2.5]" />
                                            ) : (
                                                <Eye size={18} className="stroke-[2.5]" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1.5 text-xs font-bold text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-base shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
                                >
                                    <span>{processing ? 'Menyimpan Password...' : 'Simpan Password Baru'}</span>
                                    {!processing && <ArrowRight size={18} className="stroke-[3]" />}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
