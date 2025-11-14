import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Register() {
    const [isVisible, setIsVisible] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />
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
                                    Daftar
                                </h2>
                                <p className="text-gray-600 text-base">
                                    Mulai perjalanan keuangan bersama pasangan Anda.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Nama
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-colors"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama lengkap Anda"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

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
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Minimal 8 karakter"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:ring-0 transition-colors"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi password Anda"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {processing ? 'Memproses...' : 'Daftar Sekarang'}
                                </button>

                                {/* Login Link */}
                                <div className="text-center pt-4">
                                    <Link
                                        href={route('login')}
                                        className="text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        Sudah punya akun? <span className="font-semibold">Masuk</span>
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
