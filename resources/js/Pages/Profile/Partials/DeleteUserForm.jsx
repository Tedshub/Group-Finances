// resources/js/Pages/Profile/Partials/DeleteUserForm.jsx
import DangerButton from '@/Components/Profil/DangerButton';
import InputError from '@/Components/Profil/InputError';
import InputLabel from '@/Components/Profil/InputLabel';
import Modal from '@/Components/Profil/Modal';
import SecondaryButton from '@/Components/Profil/SecondaryButton';
import TextInput from '@/Components/Profil/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-serif font-semibold text-black">
                            Hapus Akun
                        </h2>
                        <p className="mt-1 text-xs text-gray-700">
                            Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen. Sebelum menghapus akun Anda, silakan unduh data atau informasi yang ingin Anda simpan.
                        </p>
                    </div>
                </div>
            </header>

            <DangerButton
                onClick={confirmUserDeletion}
                className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800"
            >
                Hapus Akun
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-semibold text-gray-900">
                                Apakah Anda yakin ingin menghapus akun Anda?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Setelah akun Anda dihapus, semua sumber daya dan data akan dihapus secara permanen. Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi"
                            className="text-sm font-medium text-gray-900"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-2 block w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                            isFocused
                            placeholder="Masukkan kata sandi Anda"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={closeModal}
                            className="rounded-lg"
                        >
                            Batal
                        </SecondaryButton>
                        <DangerButton
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 rounded-lg"
                        >
                            Hapus Akun
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
