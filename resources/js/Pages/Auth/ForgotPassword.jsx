// resources/js/Pages/Auth/ForgotPassword.jsx
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Logo from '@/Layouts/Logo';

export default function ForgotPassword({ status }) {
    const [isVisible, setIsVisible] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    // Auto reload satu kali saat halaman pertama kali dibuka
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('forgotPasswordPageReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('forgotPasswordPageReloaded', 'true');
            window.location.reload();
        } else {
            setIsVisible(true);
        }

        return () => {
            sessionStorage.removeItem('forgotPasswordPageReloaded');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password - Group Finances" />
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
                                <div className="w-12 h-12 rounded-full border-2 border-black bg-[#FDBB4E] flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_#000]">
                                    <Mail size={22} className="text-black stroke-[2.5]" />
                                </div>
                                <h2
                                    className="text-3xl sm:text-4xl font-black text-black mb-2 leading-tight"
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Lupa Password?
                                </h2>
                                <p className="text-black/70 text-sm font-bold leading-relaxed">
                                    Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang password baru Anda.
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
                                        Alamat Email Terdaftar
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3.5 px-6 rounded-full border-2 border-black bg-[#7c98ff] hover:bg-[#6a88fc] text-black font-black text-base shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>{processing ? 'Mengirim Tautan...' : 'Kirim Tautan Reset Password'}</span>
                                    {!processing && <Send size={16} className="stroke-[2.5]" />}
                                </button>

                                {/* Back to Login Link */}
                                <div className="text-center pt-3 border-t-2 border-black/10">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-1.5 text-xs font-black text-black underline underline-offset-4 hover:text-[#5B7FF0] transition-colors"
                                    >
                                        <ArrowLeft size={14} className="stroke-[3]" />
                                        <span>Kembali ke Halaman Masuk</span>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
