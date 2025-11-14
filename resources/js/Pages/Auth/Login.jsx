import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
    const [isVisible, setIsVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />
            <div className="min-h-screen bg-[#C8F5C8] flex flex-col overflow-x-hidden">
                {/* Header/Logo */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl sm:text-2xl">S</span>
                        </div>
                        <h1 className="text-black font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
                            COUPLE'S FINANCES
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
                                    Masuk
                                </h2>
                                <p className="text-gray-600 text-base">
                                    Selamat datang kembali! Silakan masuk ke akun Anda.
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

                                {/* Password Field */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-colors"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
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
                                        className="w-4 h-4 border-2 border-gray-300 rounded text-black focus:ring-0 focus:ring-offset-0"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Ingat saya
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses...' : 'Masuk'}
                                </button>

                                {/* Forgot Password & Register Links */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                    <Link
                                        href={route('register')}
                                        className="text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        Belum punya akun? <span className="font-semibold">Daftar</span>
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
