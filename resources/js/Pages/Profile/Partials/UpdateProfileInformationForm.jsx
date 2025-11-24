// resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx
import InputError from '@/Components/Profil/InputError';
import InputLabel from '@/Components/Profil/InputLabel';
import PrimaryButton from '@/Components/Profil/PrimaryButton';
import TextInput from '@/Components/Profil/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-lg font-serif font-semibold text-black">
                    Informasi Profil
                </h2>
                <p className="mt-1 text-xs text-gray-700">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nama" className="text-sm font-medium text-gray-900" />
                    <TextInput
                        id="name"
                        className="mt-2 block w-full rounded-lg border-gray-300 focus:border-[#7c98ff] focus:ring-[#7c98ff]"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-sm font-medium text-gray-900" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full rounded-lg border-gray-300 focus:border-[#7c98ff] focus:ring-[#7c98ff]"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                        <p className="text-sm text-gray-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm text-[#7c98ff] underline hover:text-[#6080e0] focus:outline-none focus:ring-2 focus:ring-[#7c98ff] focus:ring-offset-2"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Link verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-[#7c98ff] hover:bg-[#6080e0] focus:bg-[#6080e0] active:bg-[#5070d0]"
                    >
                        Simpan Perubahan
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium">
                            Berhasil disimpan!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
