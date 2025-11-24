import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
            // Tampilkan animasi setelah reload
            setIsVisible(true);
        }

        // Cleanup: hapus flag saat komponen unmount (pindah halaman)
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
            <Head title="Lupa Password" />
            <div className="min-h-screen bg-[#C8F5C8] flex flex-col overflow-x-hidden">
                {/* Header/Logo */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl sm:text-2xl">G</span>
                        </div>
                        <h1 className="text-black font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
                            GROUP FINANCES
                        </h1>
                    </Link>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="max-w-md w-full">
                        <div
                            className={`bg-white rounded-3xl shadow-lg p-8 sm:p-10 transition-all duration-1000 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            {/* Title */}
                            <div className="mb-8">
                                <h2 className="text-4xl sm:text-5xl font-serif text-black mb-3">
                                    Lupa Password
                                </h2>
                                <p className="text-gray-600 text-base">
                                    Tidak masalah. Beri tahu kami alamat email Anda dan kami akan mengirimkan tautan reset password yang memungkinkan Anda memilih yang baru.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                    {status}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-colors"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Tautan Reset Password'}
                                </button>

                                {/* Back to Login Link */}
                                <div className="flex items-center justify-center pt-4">
                                    <Link
                                        href={route('login')}
                                        className="text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        Kembali ke <span className="font-semibold">Masuk</span>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

                h2 {
                    font-family: 'Libre Baskerville', serif;
                }

                body {
                    font-family: 'Inter', sans-serif;
                }
            `}</style>
        </>
    );
}
