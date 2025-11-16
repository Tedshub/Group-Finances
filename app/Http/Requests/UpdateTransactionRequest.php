<?php
// app/Http/Requests/UpdateTransactionRequest.php

namespace App\Http\Requests;

use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $relation = $this->route('relation');
        $transaction = $this->route('transaction');

        // Cek apakah user sudah join relation DAN adalah pemilik transaksi
        return $this->user()->hasJoinedRelation($relation->id)
            && $transaction->isOwnedBy($this->user()->id);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'jenis' => [
                'required',
                Rule::in([Transaction::JENIS_PEMASUKAN, Transaction::JENIS_PENGELUARAN])
            ],
            'jumlah' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999999999.99',
            ],
            'catatan' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'bukti' => [
                'nullable',
                'file',
                'mimes:jpg,jpeg,png,pdf',
                'max:5120',
            ],
            'waktu_transaksi' => [
                'required',
                'date',
                'before_or_equal:now',
            ],
            'remove_bukti' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'jenis.required' => 'Jenis transaksi wajib diisi.',
            'jenis.in' => 'Jenis transaksi harus pemasukan atau pengeluaran.',
            'jumlah.required' => 'Jumlah transaksi wajib diisi.',
            'jumlah.numeric' => 'Jumlah harus berupa angka.',
            'jumlah.min' => 'Jumlah minimal adalah 0.01',
            'jumlah.max' => 'Jumlah terlalu besar.',
            'catatan.max' => 'Catatan maksimal 1000 karakter.',
            'bukti.file' => 'Bukti harus berupa file.',
            'bukti.mimes' => 'Bukti harus berupa file JPG, JPEG, PNG, atau PDF.',
            'bukti.max' => 'Ukuran file bukti maksimal 5MB.',
            'waktu_transaksi.required' => 'Waktu transaksi wajib diisi.',
            'waktu_transaksi.date' => 'Format waktu transaksi tidak valid.',
            'waktu_transaksi.before_or_equal' => 'Waktu transaksi tidak boleh di masa depan.',
            'remove_bukti.boolean' => 'Flag hapus bukti tidak valid.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'jenis' => 'jenis transaksi',
            'jumlah' => 'jumlah',
            'catatan' => 'catatan',
            'bukti' => 'bukti transaksi',
            'waktu_transaksi' => 'waktu transaksi',
            'remove_bukti' => 'hapus bukti',
        ];
    }
}
