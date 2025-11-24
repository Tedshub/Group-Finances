// resources/js/Components/Transactions/TransactionTable.jsx

import React from "react";
import { router } from '@inertiajs/react';

export default function TransactionTable({
  title,
  type,
  data,
  isMobile,
  onShowDetail,
  onEdit,
  onDelete,
  onPreviewBukti, // Add this new prop
  formatDate,
  formatCurrency,
  searchTerm,
  selectedRelationId
}) {
  const titleColor = type === 'pemasukan' ? 'text-green-700' : 'text-red-700';
  const amountColor = type === 'pemasukan' ? 'text-green-600' : 'text-red-600';

  const renderMobileRow = (transaction) => (
    <tr key={transaction.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.waktu_transaksi)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${amountColor}`}>
        {formatCurrency(transaction.jumlah)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onShowDetail(transaction)}
          className="text-indigo-600 hover:text-indigo-900 rounded-full p-2"
          title="Lihat Detail"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </td>
    </tr>
  );

  const renderDesktopRow = (transaction) => (
    <tr key={transaction.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(transaction.waktu_transaksi)}
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${amountColor}`}>
        {formatCurrency(transaction.jumlah)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {transaction.catatan || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {transaction.bukti_url ? (
          <button
            onClick={() => onPreviewBukti(transaction)}
            className="text-pink-500 hover:text-pink-700 font-medium"
          >
            Lihat Bukti
          </button>
        ) : (
          '-'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {transaction.user ? transaction.user.name : transaction.user_name || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {transaction.can_edit && (
          <button
            onClick={() => onEdit(transaction)}
            className="text-indigo-600 hover:text-indigo-900 mr-3 border border-black rounded px-2 py-1"
          >
            Edit
          </button>
        )}
        {transaction.can_delete && (
          <button
            onClick={() => onDelete(transaction)}
            className="text-red-600 hover:text-red-900 border border-black rounded px-2 py-1"
          >
            Hapus
          </button>
        )}
      </td>
    </tr>
  );

  const renderPagination = () => {
    if (!data || !data.links) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Menampilkan {data.from || 0} - {data.to || 0} dari {data.total || 0} transaksi
        </div>
        <div className="flex gap-2">
          {data.links.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (link.url && selectedRelationId) {
                  router.get(link.url, {
                    search: searchTerm,
                  }, {
                    preserveState: true,
                    preserveScroll: true,
                  });
                }
              }}
              disabled={!link.url}
              className={`px-3 py-1 rounded text-sm border border-black ${
                link.active
                  ? 'bg-[#C8F5C8] text-black'
                  : link.url
                  ? 'bg-white text-black hover:bg-gray-50'
                  : 'bg-gray-100 text-black cursor-not-allowed'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 mb-6 border border-black">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between border-b border-black">
        <h2 className={`text-lg font-medium ${titleColor}`}>{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {isMobile ? (
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Bukti
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            )}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.data?.length > 0 ? (
              data.data.map((transaction) =>
                isMobile
                  ? renderMobileRow(transaction)
                  : renderDesktopRow(transaction)
              )
            ) : (
              <tr>
                <td colSpan={isMobile ? "3" : "6"} className="px-6 py-4 text-center text-sm text-gray-500">
                  Tidak ada data {type}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}
