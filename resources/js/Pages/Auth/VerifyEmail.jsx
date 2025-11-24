import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function VerifyEmail({ status }) {
    const [isVisible, setIsVisible] = useState(false);

    const { post, processing } = useForm({});

    // Auto reload satu kali saat halaman pertama kali dibuka
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('verifyEmailPageReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('verifyEmailPageReloaded', 'true');
            window.location.reload();
        } else {
            // Tampilkan animasi setelah reload
            setIsVisible(true);
        }

        // Cleanup: hapus flag saat komponen unmount (pindah halaman)
        return () => {
            sessionStorage.removeItem('verifyEmailPageReloaded');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verifikasi Email" />
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
                                    Verifikasi Email
                                </h2>
                                <p className="text-gray-600 text-base">
                                    Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda memverifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan kepada Anda? Jika Anda tidak menerima email, kami dengan senang hati akan mengirimkan yang lain.
                                </p>
                            </div>

                            {/* Status Message */}
                            {status === 'verification-link-sent' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={submit} className="space-y-6">
                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-black text-white py-3 rounded-full font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                                </button>

                                {/* Logout Link */}
                                <div className="flex items-center justify-center pt-4">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-sm text-gray-600 hover:text-black transition-colors"
                                    >
                                        <span className="font-semibold">Keluar</span>
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
