import { Head, Link } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';

export default function Welcome({ auth }) {
    const [isVisible, setIsVisible] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
    const [visibleSections, setVisibleSections] = useState({});
    const [showScrollTop, setShowScrollTop] = useState(false);

    const sectionRefs = {
        why: useRef(null),
        features: useRef(null),
        feature1: useRef(null),
        feature2: useRef(null),
        feature3: useRef(null),
        cta: useRef(null)
    };

    useEffect(() => {
        setIsVisible(true);

        // Reduced button animation delay from 1200ms to 600ms
        const buttonTimer = setTimeout(() => {
            setShowButtons(true);
        }, 600);

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisibleSections(prev => ({
                        ...prev,
                        [entry.target.dataset.section]: true
                    }));
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.entries(sectionRefs).forEach(([key, ref]) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        // Scroll event listener
        const handleScroll = () => {
            const heroSection = document.querySelector('section');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                setShowScrollTop(window.scrollY > heroHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(buttonTimer);
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Icon Components
    const FamilyIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const OrganizationIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );

    const StartupIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    const RoommatesIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const RealTimeIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const BudgetIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const AnalyticsIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );

    const CollaborationIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );

    const ScrollToTopIcon = () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    );

    return (
        <>
            <Head title="Group Finances" />
            <div className="min-h-screen bg-[#C8F5C8] overflow-x-hidden">
                {/* Header/Logo */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl sm:text-2xl">G</span>
                        </div>
                        <h1 className="text-black font-bold text-lg sm:text-xl md:text-2xl tracking-wide">
                            GROUP FINANCES
                        </h1>
                    </div>
                </header>

                {/* Hero Section - Reduced Height */}
                <section className="px-4 sm:px-6 lg:px-20 py-6 sm:py-8 lg:py-10">
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                            {/* Left Section - Text Content */}
                            <div className="space-y-4 sm:space-y-6 lg:space-y-7 text-center lg:text-left">
                                {/* Main Heading */}
                                <h2
                                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-black leading-tight transition-all duration-1000 ${
                                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                                    }`}
                                >
                                    Kelola keuangan kelompok Anda dengan mudah dan transparan.
                                </h2>

                                {/* Description */}
                                <p
                                    className={`text-black text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 delay-200 ${
                                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                                    }`}
                                >
                                    Platform manajemen keuangan kolaboratif untuk pasangan, keluarga, organisasi, komunitas, dan kelompok lainnya. Transparansi penuh untuk hubungan yang lebih harmonis.
                                </p>

                                {/* Target Users */}
                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                                    {['Pasangan', 'Keluarga', 'Organisasi', 'Komunitas', 'Startup Team', 'Roommates'].map((item, index) => (
                                        <span
                                            key={item}
                                            className="bg-white/80 text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-black/20"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                                animation: showButtons ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                                            }}
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                {/* Buttons - Reduced animation duration from 700ms to 400ms */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                    {auth?.user ? (
                                        <Link
                                            href="/dashboard"
                                            className={`bg-white text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-gray-100 transition-all duration-400 shadow-sm text-center ${
                                                showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                            }`}
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/register"
                                                className={`bg-white text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-gray-100 transition-all duration-400 shadow-sm text-center ${
                                                    showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                                style={{ transitionDelay: showButtons ? '0ms' : '0ms' }}
                                            >
                                                Mulai Sekarang
                                            </Link>
                                            <Link
                                                href="/login"
                                                className={`bg-transparent text-black px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg border-2 border-black hover:bg-white transition-all duration-400 text-center ${
                                                    showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                                style={{ transitionDelay: showButtons ? '100ms' : '0ms' }}
                                            >
                                                Masuk
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Section - Image */}
                            <div className="relative flex justify-center lg:justify-end">
                                <div
                                    className={`relative w-full max-w-sm lg:max-w-lg transition-all duration-1000 ${
                                        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                                    }`}
                                >
                                    <img
                                        src="/assets/couple.png"
                                        alt="Group of people managing finances together"
                                        className="w-full h-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Section - Pentingnya Mengelola Keuangan */}
                <section
                    ref={sectionRefs.why}
                    data-section="why"
                    className="bg-[#7c98ff] relative overflow-hidden"
                >
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[450px]">

                            {/* Left Section - Image */}
                            <div className={`relative flex items-center justify-center order-2 lg:order-1 p-6 lg:p-10 transition-all duration-1000 ${
                                visibleSections.why ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                            }`}>
                                <div className="relative w-full max-w-md lg:max-w-lg max-h-[400px]">
                                    <img
                                        src="/assets/imp.png"
                                        alt="Team collaboration in finance management"
                                        className="relative w-full h-auto object-contain z-10 rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Right Section - Text Content */}
                            <div className={`flex flex-col justify-center space-y-6 sm:space-y-8 text-center lg:text-left order-1 lg:order-2 px-6 lg:px-12 py-10 sm:py-14 transition-all duration-1000 delay-200 ${
                                visibleSections.why ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                            }`}>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white leading-tight">
                                    Mengapa Penting?
                                </h2>
                                <p className="text-white text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium">
                                    Transparansi keuangan dalam kelompok membangun kepercayaan, mencegah konflik,
                                    dan memperkuat kolaborasi untuk mencapai tujuan bersama.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/20 rounded-2xl p-4 text-center">
                                        <p className="text-white font-bold text-xl">95%</p>
                                        <p className="text-white text-sm">Hindari Konflik</p>
                                    </div>
                                    <div className="bg-white/20 rounded-2xl p-4 text-center">
                                        <p className="text-white font-bold text-xl">3x</p>
                                        <p className="text-white text-sm">Lebih Efisien</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-[#c5ffbc] px-4 sm:px-6 lg:px-20 py-16 sm:py-20 lg:py-24">
                    <div className="max-w-7xl w-full mx-auto">
                        <h2
                            ref={sectionRefs.features}
                            data-section="features"
                            className={`text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-black mb-12 sm:mb-16 text-center lg:text-left transition-all duration-1000 ${
                                visibleSections.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                        >
                            Fitur Unggulan
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Feature Card 1 */}
                            <div
                                ref={sectionRefs.feature1}
                                data-section="feature1"
                                className={`border-2 border-black rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-1000 hover:-translate-y-2 bg-transparent ${
                                    visibleSections.feature1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#7c98ff] rounded-full flex items-center justify-center mb-6">
                                    <RealTimeIcon />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-black mb-4">
                                    Pelacakan Keuangan Real-time
                                </h3>
                                <p className="text-black text-sm sm:text-base leading-relaxed">
                                    Pantau arus kas kelompok secara real-time dengan akses multi-user.
                                    Cocok untuk pengelolaan keuangan keluarga, iuran komunitas, atau kas organisasi.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Kas RT</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Iuran Komunitas</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Budget Keluarga</span>
                                </div>
                            </div>

                            {/* Feature Card 2 */}
                            <div
                                ref={sectionRefs.feature2}
                                data-section="feature2"
                                className={`border-2 border-black rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-1000 delay-200 hover:-translate-y-2 bg-transparent ${
                                    visibleSections.feature2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#7c98ff] rounded-full flex items-center justify-center mb-6">
                                    <BudgetIcon />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-black mb-4">
                                    Anggaran Kolaboratif
                                </h3>
                                <p className="text-black text-sm sm:text-base leading-relaxed">
                                    Buat dan kelola anggaran bersama dengan fitur approval system.
                                    Sempurna untuk perencanaan keuangan tim, event organisasi, atau pengeluaran rumah tangga.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Event Planning</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Budget Project</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Rumah Tangga</span>
                                </div>
                            </div>

                            {/* Feature Card 3 */}
                            <div
                                ref={sectionRefs.feature3}
                                data-section="feature3"
                                className={`border-2 border-black rounded-3xl p-6 sm:p-8 hover:shadow-xl transition-all duration-1000 delay-300 hover:-translate-y-2 bg-transparent ${
                                    visibleSections.feature3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#7c98ff] rounded-full flex items-center justify-center mb-6">
                                    <AnalyticsIcon />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-serif font-bold text-black mb-4">
                                    Laporan & Analytics
                                </h3>
                                <p className="text-black text-sm sm:text-base leading-relaxed">
                                    Dapatkan insight mendalam dengan laporan visual yang dapat disesuaikan.
                                    Analisis pola pengeluaran kelompok dan buat keputusan finansial yang lebih cerdas.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Laporan Bulanan</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Analisis Trend</span>
                                    <span className="bg-[#ffff]/70 text-[#4c72ff] px-2 py-1 rounded-full text-xs">Export Data</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Use Cases */}
                        <div className="mt-16 sm:mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: 'Pasangan & Keluarga',
                                    desc: 'Kelola keuangan rumah tangga dengan transparansi',
                                    icon: <FamilyIcon />
                                },
                                {
                                    title: 'Organisasi & Komunitas',
                                    desc: 'Manage kas, iuran, dan dana kegiatan',
                                    icon: <OrganizationIcon />
                                },
                                {
                                    title: 'Startup & Tim',
                                    desc: 'Tracking pengeluaran tim dan project budget',
                                    icon: <StartupIcon />
                                },
                                {
                                    title: 'Roommates',
                                    desc: 'Bagikan biaya sewa dan kebutuhan bersama',
                                    icon: <RoommatesIcon />
                                }
                            ].map((item, index) => (
                                <div key={index} className="text-center p-6 bg-white/50 rounded-2xl border border-black/20 hover:shadow-lg transition-all duration-300">
                                    <div className="w-12 h-12 bg-[#7c98ff] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <div className="text-white">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-black mb-2">{item.title}</h4>
                                    <p className="text-black text-sm">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    ref={sectionRefs.cta}
                    data-section="cta"
                    className="bg-[#7c98ff] px-4 sm:px-6 lg:px-20 py-16 sm:py-20"
                >
                    <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
                        visibleSections.cta ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <CollaborationIcon />
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-normal text-white mb-6">
                            Siap Mengelola Keuangan Kelompok Anda?
                        </h2>
                        <p className="text-white text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                            Bergabung dengan ribuan kelompok yang telah mempercayai kami untuk pengelolaan keuangan yang lebih baik.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={auth?.user ? "/dashboard" : "/register"}
                                className="bg-white text-[#7c98ff] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                {auth?.user ? "Buka Dashboard" : "Daftar Sekarang"}
                            </Link>
                            <Link
                                href="/coming-soon"
                                className="bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-[#7c98ff] transition-all duration-300"
                            >
                                Pelajari Fitur
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#4c72ff] px-4 sm:px-6 lg:px-20 py-12 sm:py-16">
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8">
                            {/* Column 1 - Brand */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#4c72ff] font-bold text-xl">G</span>
                                    </div>
                                    <h3 className="text-white font-bold text-lg tracking-wide">
                                        GROUP FINANCES
                                    </h3>
                                </div>
                                <p className="text-white text-sm leading-relaxed">
                                    Platform manajemen keuangan kolaboratif untuk berbagai jenis kelompok. Transparan, mudah, dan terpercaya.
                                </p>
                            </div>

                            {/* Column 2 - Product */}
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-lg">Produk</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Fitur
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Harga
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Use Cases
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 3 - Company */}
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-lg">Perusahaan</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Tentang Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Blog
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-white hover:text-gray-200 text-sm transition-colors">
                                            Karir
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Column 4 - Contact */}
                            <div className="space-y-4">
                                <h4 className="text-white font-bold text-lg">Hubungi Kami</h4>
                                <ul className="space-y-2">
                                    <li className="text-white text-sm">
                                        Email: info@groupfinances.com
                                    </li>
                                    <li className="text-white text-sm">
                                        Telepon: +62 123 4567 890
                                    </li>
                                    <li className="text-white text-sm">
                                        WhatsApp: +62 812 3456 7890
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="border-t-2 border-white pt-6">
                            <p className="text-center text-white text-sm">
                                © 2025 Group Finances. All rights reserved. - Solusi untuk Pasangan, Keluarga, Organisasi, dan Komunitas
                            </p>
                        </div>
                    </div>
                </footer>

                {/* Scroll to Top Button - Changed from bottom-1/4 to bottom-8 (1/8 from bottom) */}
                <button
                    onClick={scrollToTop}
                    className={`fixed right-8 bottom-8 bg-[#7c98ff] text-white p-4 rounded-full shadow-lg hover:bg-[#4c72ff] transition-all duration-300 z-50 hover:scale-110 ${
                        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}
                    aria-label="Scroll to top"
                >
                    <ScrollToTopIcon />
                </button>
            </div>

            <style jsx>{`
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
        </>
    );
}
