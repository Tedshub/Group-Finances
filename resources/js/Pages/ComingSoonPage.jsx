// resources/js/Pages/ComingSoonPage.jsx
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoonPage({
    title = "Segera Hadir",
    description = "Kami sedang mempersiapkan sesuatu yang luar biasa untuk Anda. Fitur baru yang akan merevolusi cara Anda mengelola keuangan kelompok.",
    featureTitle = "Apa yang Akan Datang?",
    features = [
        'Integrasi dengan bank lokal Indonesia',
        'Notifikasi real-time untuk setiap transaksi',
        'Dashboard analytics yang lebih powerful',
        'Mobile app untuk iOS & Android'
    ]
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = () => {
        if (email) {
            setIsSubmitted(true);
            setEmail('');
            setTimeout(() => setIsSubmitted(false), 5000);
        }
    };

    const RocketIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    const BellIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );

    const CheckIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const SparkleIcon = () => (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L11.5 6.5L16 8L11.5 9.5L10 14L8.5 9.5L4 8L8.5 6.5L10 2Z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-[#C8F5C8] overflow-x-hidden">
            {/* Back Button */}
            <div className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 shadow-sm border border-black"
                >
                    <ArrowLeft size={20} />
                    Kembali
                </Link>
            </div>

            {/* Header/Logo */}
            <header className="px-4 sm:px-6 lg:px-20 pt-2 pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xl sm:text-2xl">G</span>
                    </div>
                    <h1 className="text-black font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
                        GROUP FINANCES
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <section className="px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center space-y-6 sm:space-y-8 mb-12 sm:mb-16">
                        {/* Icon with Animation */}
                        <div className={`inline-flex items-center justify-center transition-all duration-1000 ${
                            isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        }`}>
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#7c98ff] rounded-full flex items-center justify-center">
                                    <RocketIcon />
                                </div>
                                {/* Floating Sparkles */}
                                <div className="absolute -top-2 -right-2 text-[#4c72ff] animate-bounce">
                                    <SparkleIcon />
                                </div>
                                <div className="absolute -bottom-1 -left-1 text-[#4c72ff] animate-pulse">
                                    <SparkleIcon />
                                </div>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-normal text-black leading-tight transition-all duration-1000 delay-200 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            {title}
                        </h2>

                        {/* Description */}
                        <p className={`text-black text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
                            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                            {description}
                        </p>
                    </div>

                    {/* Features Preview */}
                    <div className={`bg-[#7c98ff] rounded-3xl p-8 sm:p-12 mb-12 transition-all duration-1000 delay-400 ${
                        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6 text-center">
                            {featureTitle}
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 bg-white/20 rounded-2xl p-4 transition-all duration-300 hover:bg-white/30"
                                    style={{
                                        animationDelay: `${500 + index * 100}ms`,
                                        animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                                    }}
                                >
                                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <CheckIcon />
                                    </div>
                                    <p className="text-white font-medium">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Email Subscription */}
                    <div className={`bg-[#c5ffbc] border-2 border-black rounded-3xl p-8 sm:p-12 transition-all duration-1000 delay-600 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="max-w-2xl mx-auto text-center">
                            <div className="w-12 h-12 bg-[#7c98ff] rounded-full flex items-center justify-center mx-auto mb-4">
                                <BellIcon />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-4">
                                Jadilah Yang Pertama Tahu
                            </h3>
                            <p className="text-black text-base sm:text-lg mb-6">
                                Daftarkan email Anda dan dapatkan notifikasi saat fitur ini diluncurkan,
                                plus akses early bird eksklusif!
                            </p>

                            {isSubmitted ? (
                                <div className="bg-white rounded-full p-6 flex items-center justify-center gap-3 animate-bounce">
                                    <div className="w-8 h-8 bg-[#7c98ff] rounded-full flex items-center justify-center">
                                        <CheckIcon />
                                    </div>
                                    <p className="text-black font-bold text-lg">
                                        Terima kasih! Kami akan menghubungi Anda segera.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="nama@email.com"
                                        className="flex-1 px-6 py-4 rounded-full border-2 border-black text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7c98ff]"
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-[#7c98ff] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#4c72ff] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    >
                                        Beritahu Saya
                                    </button>
                                </div>
                            )}

                            <p className="text-black text-sm mt-4 opacity-70">
                                Kami menghargai privasi Anda. Tidak ada spam, janji!
                            </p>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <p className="text-black text-base sm:text-lg mb-4">
                            Bergabung dengan <span className="font-bold">2,500+</span> pengguna yang sudah menunggu
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {['Pasangan', 'Keluarga', 'Organisasi', 'Komunitas', 'Startup', 'Roommates'].map((tag, index) => (
                                <span
                                    key={tag}
                                    className="bg-white/80 text-black px-4 py-2 rounded-full text-sm font-medium border border-black/20"
                                    style={{
                                        animationDelay: `${800 + index * 100}ms`,
                                        animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#4c72ff] px-4 sm:px-6 lg:px-20 py-8 sm:py-12 mt-12">
                <div className="max-w-7xl w-full mx-auto text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span className="text-[#4c72ff] font-bold text-xl">G</span>
                        </div>
                        <h3 className="text-white font-bold text-lg tracking-wide">
                            GROUP FINANCES
                        </h3>
                    </div>
                    <p className="text-white text-sm mb-4">
                        Platform manajemen keuangan kolaboratif untuk berbagai jenis kelompok.
                    </p>
                    <p className="text-white text-sm opacity-80">
                        © 2025 Group Finances. All rights reserved.
                    </p>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

                h2, h3 {
                    font-family: 'Libre Baskerville', serif;
                }

                body {
                    font-family: 'Inter', sans-serif;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
