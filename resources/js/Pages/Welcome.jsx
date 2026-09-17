// resources/js/Pages/Welcome.jsx
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import {
    Users, Building2, Zap, Home, Clock, BarChart3, LineChart,
    ArrowUpRight, ArrowUp, Check, Sparkles, ShieldCheck, MessageCircle,
    PiggyBank, Wallet, TrendingUp, Star, ChevronRight
} from 'lucide-react';
import Logo from '@/Layouts/Logo';

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

        const buttonTimer = setTimeout(() => {
            setShowButtons(true);
        }, 400);

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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <Head title="Group Finances - Kelola Keuangan Kolaboratif" />
            <div className="min-h-screen bg-[#C8F5C8] overflow-x-hidden">

                {/* Header/Logo Neobrutalism */}
                <header className="px-4 sm:px-6 lg:px-20 pt-6 sm:pt-8 pb-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Logo size="lg" href="/" showBadge={true} hideTextOnMobile={true} />
                        <nav className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-black text-white px-5 py-2 rounded-full font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#555] hover:shadow-[4px_4px_0px_0px_#555] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                                >
                                    Dashboard <ArrowUpRight size={14} />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-black font-black text-sm px-4 py-2 rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white px-5 py-2 rounded-full font-black text-sm border-2 border-black shadow-[3px_3px_0px_0px_#555] hover:shadow-[4px_4px_0px_0px_#555] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                                    >
                                        Daftar Gratis <ChevronRight size={14} />
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* ===== HERO SECTION ===== */}
                <section className="px-4 sm:px-6 lg:px-20 py-8 sm:py-10 lg:py-14">
                    <div className="max-w-7xl w-full mx-auto">

                        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-center">
                            {/* Left Section - Text Content */}
                            <div className="space-y-5 sm:space-y-6 lg:space-y-7 text-center lg:text-left">
                                {/* Main Heading */}
                                <h1
                                    className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.05] transition-all duration-1000 ${
                                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                                    }`}
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Kelola{' '}
                                    <span className="relative inline-block">
                                        <span className="relative z-10">Keuangan</span>
                                        <span className="absolute bottom-1 left-0 w-full h-4 bg-[#FDBB4E] -z-0 -rotate-1 border border-black" />
                                    </span>{' '}
                                    Kelompok Anda.
                                </h1>

                                {/* Description */}
                                <p
                                    className={`text-black font-semibold text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 transition-all duration-1000 delay-200 ${
                                        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                                    }`}
                                >
                                    Platform manajemen keuangan kolaboratif untuk pasangan, keluarga, organisasi, komunitas, dan tim kerja. Transparansi penuh untuk hubungan finansial yang lebih harmonis.
                                </p>

                                {/* Key Benefits */}
                                <div className={`flex flex-col gap-2.5 text-left transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    {[
                                        { icon: <ShieldCheck size={15} />, text: 'Data aman & terenkripsi penuh', color: 'bg-[#C8F5C8]' },
                                        { icon: <MessageCircle size={15} />, text: 'Chat & notifikasi realtime', color: 'bg-[#7c98ff]' },
                                        { icon: <BarChart3 size={15} />, text: 'Laporan & analitik otomatis', color: 'bg-[#FDBB4E]' },
                                    ].map((b, i) => (
                                        <div key={i} className="inline-flex items-center gap-2 mx-auto lg:mx-0">
                                            <span className={`w-6 h-6 ${b.color} border border-black rounded-md flex items-center justify-center flex-shrink-0`}>
                                                {b.icon}
                                            </span>
                                            <span className="text-black font-bold text-sm">{b.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Target Users Badges */}
                                <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center lg:justify-start">
                                    {[
                                        { label: 'Pasangan', icon: <Users size={11} /> },
                                        { label: 'Keluarga', icon: <Home size={11} /> },
                                        { label: 'Organisasi', icon: <Building2 size={11} /> },
                                        { label: 'Komunitas', icon: <Users size={11} /> },
                                        { label: 'Startup Team', icon: <Zap size={11} /> },
                                        { label: 'Roommates', icon: <Home size={11} /> },
                                    ].map((item, index) => (
                                        <span
                                            key={item.label}
                                            className="bg-white text-black px-3 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5"
                                            style={{
                                                animationDelay: `${index * 80}ms`,
                                                animation: showButtons ? 'fadeInUp 0.4s ease-out forwards' : 'none'
                                            }}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </span>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center lg:justify-start pt-2">
                                    {auth?.user ? (
                                        <Link
                                            href="/dashboard"
                                            className={`bg-black text-white px-8 sm:px-10 py-4 rounded-2xl font-black text-base sm:text-lg border-2 border-black shadow-[5px_5px_0px_0px_#555] hover:shadow-[7px_7px_0px_0px_#555] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center flex items-center justify-center gap-2 ${
                                                showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                            }`}
                                        >
                                            Buka Dashboard <ArrowUpRight size={18} />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href="/register"
                                                className={`bg-black text-white px-8 sm:px-10 py-4 rounded-2xl font-black text-base sm:text-lg border-2 border-black shadow-[5px_5px_0px_0px_#555] hover:shadow-[7px_7px_0px_0px_#555] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center flex items-center justify-center gap-2 ${
                                                    showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                            >
                                                Mulai Gratis <ArrowUpRight size={18} />
                                            </Link>
                                            <Link
                                                href="/login"
                                                className={`bg-white text-black px-8 sm:px-10 py-4 rounded-2xl font-black text-base sm:text-lg border-2 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-center ${
                                                    showButtons ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                                }`}
                                                style={{ transitionDelay: showButtons ? '80ms' : '0ms' }}
                                            >
                                                Masuk
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Section - Visual Hero Card */}
                            <div
                                className={`relative flex justify-center lg:justify-end transition-all duration-1000 ${
                                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                                }`}
                            >
                                {/* Decorative bg blocks */}
                                <div className="absolute -top-4 -right-4 w-40 h-40 bg-[#FDBB4E] border-2 border-black rounded-3xl -z-10" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#7c98ff] border-2 border-black rounded-2xl -z-10" />

                                <div className="relative w-full max-w-sm lg:max-w-md bg-white border-2 border-black rounded-3xl shadow-[8px_8px_0px_0px_#000] overflow-hidden">
                                    {/* Card Header */}
                                    <div className="bg-[#7c98ff] border-b-2 border-black px-5 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#FF6B7A] border border-black" />
                                            <div className="w-3 h-3 rounded-full bg-[#FDBB4E] border border-black" />
                                            <div className="w-3 h-3 rounded-full bg-[#C8F5C8] border border-black" />
                                        </div>
                                        <span className="font-black text-black text-xs uppercase tracking-wider">Kas Keluarga Budi</span>
                                        <div className="w-6 h-6 bg-[#C8F5C8] border border-black rounded-full flex items-center justify-center">
                                            <Users size={12} className="text-black" />
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5 space-y-4">
                                        {/* Balance */}
                                        <div className="bg-[#C8F5C8] border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_#000]">
                                            <p className="text-black/60 font-bold text-xs uppercase tracking-wider mb-1">Total Saldo</p>
                                            <p className="text-black font-black text-3xl">Rp 4.750.000</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <TrendingUp size={12} className="text-green-600" />
                                                <span className="text-green-600 font-black text-xs">+12% bulan ini</span>
                                            </div>
                                        </div>

                                        {/* Recent Transactions */}
                                        <div>
                                            <p className="text-black font-black text-xs uppercase tracking-wider mb-2.5">Transaksi Terbaru</p>
                                            <div className="space-y-2">
                                                {[
                                                    { label: 'Iuran Bulanan', amount: '+500.000', type: 'in', icon: <PiggyBank size={13} />, color: 'bg-[#C8F5C8]' },
                                                    { label: 'Belanja Dapur', amount: '-185.000', type: 'out', icon: <Wallet size={13} />, color: 'bg-[#FF6B7A]' },
                                                    { label: 'Listrik & Air', amount: '-220.000', type: 'out', icon: <Zap size={13} />, color: 'bg-[#FDBB4E]' },
                                                ].map((tx, i) => (
                                                    <div key={i} className="flex items-center justify-between bg-gray-50 border border-black/10 rounded-xl px-3 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-6 h-6 ${tx.color} border border-black rounded-lg flex items-center justify-center`}>
                                                                {tx.icon}
                                                            </div>
                                                            <span className="text-black font-bold text-xs">{tx.label}</span>
                                                        </div>
                                                        <span className={`font-black text-xs ${tx.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                                                            {tx.amount}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Members */}
                                        <div className="flex items-center justify-between border-t-2 border-dashed border-black/20 pt-3">
                                            <div className="flex -space-x-2">
                                                {['B', 'S', 'R', 'A'].map((initial, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-black text-xs text-black"
                                                        style={{ background: ['#7c98ff', '#FDBB4E', '#FF6B7A', '#C8F5C8'][i] }}
                                                    >
                                                        {initial}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-black/60 font-black text-xs">4 anggota aktif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Section */}
                <section
                    ref={sectionRefs.why}
                    data-section="why"
                    className="bg-[#7c98ff] border-y-2 border-black relative overflow-hidden py-12 sm:py-16"
                >
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-20">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">

                            {/* Left Section - Image */}
                            <div className={`relative flex items-center justify-center order-2 lg:order-1 transition-all duration-1000 ${
                                visibleSections.why ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                            }`}>
                                <div className="relative w-full max-w-md lg:max-w-lg bg-white border-2 border-black rounded-3xl p-3 shadow-[6px_6px_0px_0px_#000]">
                                    <img
                                        src="/assets/imp.png"
                                        alt="Team collaboration in finance management"
                                        className="w-full h-auto object-contain rounded-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Right Section - Text Content */}
                            <div className={`flex flex-col justify-center space-y-6 text-center lg:text-left order-1 lg:order-2 transition-all duration-1000 delay-200 ${
                                visibleSections.why ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                            }`}>
                                <h2
                                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-tight"
                                    style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                                >
                                    Mengapa Penting?
                                </h2>
                                <p className="text-black text-lg sm:text-xl leading-relaxed font-bold">
                                    Transparansi keuangan dalam kelompok membangun kepercayaan, mencegah konflik finansial, dan memperkuat kerja sama untuk mencapai tujuan bersama.
                                </p>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-white border-2 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_#000]">
                                        <p className="text-black font-black text-3xl">95%</p>
                                        <p className="text-black/80 font-bold text-xs sm:text-sm mt-1">Hindari Konflik</p>
                                    </div>
                                    <div className="bg-[#c5ffbc] border-2 border-black rounded-2xl p-4 text-center shadow-[4px_4px_0px_0px_#000]">
                                        <p className="text-black font-black text-3xl">3x</p>
                                        <p className="text-black/80 font-bold text-xs sm:text-sm mt-1">Lebih Efisien</p>
                                    </div>
                                </div>
            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="bg-[#c5ffbc] px-4 sm:px-6 lg:px-20 py-16 sm:py-20 lg:py-24 border-b-2 border-black">
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="mb-12 sm:mb-16 text-center lg:text-left">
                            <h2
                                ref={sectionRefs.features}
                                data-section="features"
                                className={`text-4xl sm:text-5xl md:text-6xl font-black text-black mb-3 transition-all duration-1000 ${
                                    visibleSections.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                            >
                                Fitur Unggulan
                            </h2>
                            <p className="text-black/80 font-bold text-base sm:text-lg">
                                Didesain untuk memudahkan kolaborasi keuangan tanpa kerumitan
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {/* Feature Card 1 */}
                            <div
                                ref={sectionRefs.feature1}
                                data-section="feature1"
                                className={`bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 ${
                                    visibleSections.feature1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#7c98ff] rounded-2xl border-2 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]">
                                    <Clock size={22} className="text-black" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-black mb-3">
                                    Pelacakan Real-time
                                </h3>
                                <p className="text-black/80 text-sm sm:text-base font-medium leading-relaxed mb-4">
                                    Pantau arus kas kelompok secara langsung dengan akses multi-user. Cocok untuk kas organisasi, uang kas kantor, atau keuangan rumah tangga.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-black/10">
                                    <span className="bg-[#C8F5C8] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Kas RT</span>
                                    <span className="bg-[#C8F5C8] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Iuran Komunitas</span>
                                    <span className="bg-[#C8F5C8] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Budget Keluarga</span>
                                </div>
                            </div>

                            {/* Feature Card 2 */}
                            <div
                                ref={sectionRefs.feature2}
                                data-section="feature2"
                                className={`bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 delay-100 ${
                                    visibleSections.feature2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#FDBB4E] rounded-2xl border-2 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]">
                                    <BarChart3 size={22} className="text-black" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-black mb-3">
                                    Anggaran Kolaboratif
                                </h3>
                                <p className="text-black/80 text-sm sm:text-base font-medium leading-relaxed mb-4">
                                    Buat dan kelola target anggaran bersama dengan sistem approval transparan. Sempurna untuk event planning dan biaya project.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-black/10">
                                    <span className="bg-[#FDBB4E] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Event Planning</span>
                                    <span className="bg-[#FDBB4E] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Budget Project</span>
                                    <span className="bg-[#FDBB4E] text-black border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Rumah Tangga</span>
                                </div>
                            </div>

                            {/* Feature Card 3 */}
                            <div
                                ref={sectionRefs.feature3}
                                data-section="feature3"
                                className={`bg-white border-2 border-black rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 delay-200 ${
                                    visibleSections.feature3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                            >
                                <div className="w-12 h-12 bg-[#FF6B7A] rounded-2xl border-2 border-black flex items-center justify-center mb-6 shadow-[2px_2px_0px_0px_#000]">
                                    <LineChart size={22} className="text-black" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-black mb-3">
                                    Laporan & Analytics
                                </h3>
                                <p className="text-black/80 text-sm sm:text-base font-medium leading-relaxed mb-4">
                                    Dapatkan wawasan mendalam dengan visualisasi tren keuangan. Analisis pola pengeluaran kelompok secara cerdas dan akurat.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-black/10">
                                    <span className="bg-[#FF6B7A] text-white border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Laporan Bulanan</span>
                                    <span className="bg-[#FF6B7A] text-white border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Analisis Tren</span>
                                    <span className="bg-[#FF6B7A] text-white border border-black px-2.5 py-1 rounded-full text-xs font-black shadow-[1px_1px_0px_0px_#000]">Export Data</span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Use Cases */}
                        <div className="mt-14 sm:mt-18 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[
                                {
                                    title: 'Pasangan & Keluarga',
                                    desc: 'Kelola keuangan rumah tangga dengan transparansi penuh',
                                    icon: <Users size={20} className="text-black" />,
                                    color: '#c5ffbc'
                                },
                                {
                                    title: 'Organisasi & Komunitas',
                                    desc: 'Kelola kas, iuran anggota, dan dana operasional',
                                    icon: <Building2 size={20} className="text-black" />,
                                    color: '#7c98ff'
                                },
                                {
                                    title: 'Startup & Tim',
                                    desc: 'Tracking pengeluaran tim dan operasional project',
                                    icon: <Zap size={20} className="text-black" />,
                                    color: '#FDBB4E'
                                },
                                {
                                    title: 'Roommates',
                                    desc: 'Bagikan biaya sewa dan kebutuhan hidup bersama',
                                    icon: <Home size={20} className="text-black" />,
                                    color: '#FF6B7A'
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div
                                        className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_#000]"
                                        style={{ background: item.color }}
                                    >
                                        {item.icon}
                                    </div>
                                    <h4 className="font-black text-black mb-1.5 text-base">{item.title}</h4>
                                    <p className="text-black/70 text-xs font-bold leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    ref={sectionRefs.cta}
                    data-section="cta"
                    className="bg-[#7c98ff] px-4 sm:px-6 lg:px-20 py-16 sm:py-20 border-b-2 border-black"
                >
                    <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
                        visibleSections.cta ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="w-16 h-16 bg-white rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_#000]">
                            <Star size={28} className="text-black fill-[#FDBB4E]" />
                        </div>
                        <h2
                            className="text-4xl sm:text-5xl font-black text-black mb-5"
                            style={{ fontFamily: "'DM Serif Display', 'Libre Baskerville', serif" }}
                        >
                            Siap Mengelola Keuangan Kelompok Anda?
                        </h2>
                        <p className="text-black font-bold text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                            Bergabung dengan ribuan kelompok yang telah mempercayai kami untuk pencatatan keuangan yang transparan dan aman.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={auth?.user ? "/dashboard" : "/register"}
                                className="bg-black text-white px-8 py-4 rounded-2xl font-black text-lg border-2 border-black shadow-[5px_5px_0px_0px_#444] hover:shadow-[7px_7px_0px_0px_#444] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                {auth?.user ? "Buka Dashboard" : "Daftar Sekarang"} <ArrowUpRight size={20} />
                            </Link>
                            <Link
                                href="/coming-soon?feature=learn"
                                className="bg-[#c5ffbc] text-black px-8 py-4 rounded-2xl font-black text-lg border-2 border-black shadow-[5px_5px_0px_0px_#000] hover:shadow-[7px_7px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                Pelajari Fitur <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black text-white px-4 sm:px-6 lg:px-20 py-12 sm:py-16">
                    <div className="max-w-7xl w-full mx-auto">
                        <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-8">
                            {/* Column 1 - Brand */}
                            <div className="space-y-4">
                                <Logo size="md" href="/" inverted={true} showBadge={false} />
                                <p className="text-white/70 text-sm leading-relaxed font-medium">
                                    Platform manajemen keuangan kolaboratif untuk berbagai jenis kelompok. Transparan, mudah, dan terpercaya.
                                </p>
                            </div>

                            {/* Column 2 - Product */}
                            <div className="space-y-3">
                                <h4 className="text-white font-black text-base uppercase tracking-wider">Produk</h4>
                                <ul className="space-y-2 text-sm font-semibold text-white/70">
                                    <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                                    <li><Link href="/transactions" className="hover:text-white transition-colors">Transaksi</Link></li>
                                    <li><Link href="/relations" className="hover:text-white transition-colors">Hubungan Grup</Link></li>
                                </ul>
                            </div>

                            {/* Column 3 - Company */}
                            <div className="space-y-3">
                                <h4 className="text-white font-black text-base uppercase tracking-wider">Perusahaan</h4>
                                <ul className="space-y-2 text-sm font-semibold text-white/70">
                                    <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                                    <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                                </ul>
                            </div>

                            {/* Column 4 - Contact */}
                            <div className="space-y-3">
                                <h4 className="text-white font-black text-base uppercase tracking-wider">Hubungi Kami</h4>
                                <ul className="space-y-2 text-sm font-semibold text-white/70">
                                    <li>Email: info@groupfinances.com</li>
                                    <li>Telepon: +62 123 4567 890</li>
                                    <li>WhatsApp: +62 812 3456 7890</li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="border-t border-white/20 pt-6">
                            <p className="text-center text-white/60 text-xs font-bold">
                                © 2026 Group Finances. All rights reserved. Solusi keuangan kolaboratif untuk Pasangan, Keluarga, Organisasi, dan Komunitas.
                            </p>
                        </div>
                    </div>
                </footer>

                {/* Scroll to Top Button */}
                <button
                    onClick={scrollToTop}
                    className={`fixed right-6 bottom-6 bg-white text-black p-3.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all z-50 cursor-pointer ${
                        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    }`}
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={20} className="text-black" />
                </button>
            </div>
        </>
    );
}
