// resources/js/Pages/Profile/Edit.jsx
import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const handleBack = () => {
        router.visit(route('dashboard'));
    };

    return (
        <>
            <Head title="Profile" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header with Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-black flex items-center justify-center group-hover:bg-gray-50 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">Kembali</span>
                        </button>
                    </div>

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black">Pengaturan Profil</h1>
                        <p className="text-sm text-gray-600 mt-1">Kelola pengaturan dan preferensi akun Anda</p>
                    </div>

                    {/* Two Column Layout for Profile Info and Password */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className=""
                            />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black">
                            <UpdatePasswordForm className="" />
                        </div>
                    </div>

                    {/* Delete Account Section - Full Width */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-sm border border-red-300">
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </>
    );
}
