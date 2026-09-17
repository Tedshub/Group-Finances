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
  onPreviewBukti,
  formatDate,
  formatCurrency,
  searchTerm,
  selectedRelationId,
  currentUserId
}) {
  const isIncome = type === 'pemasukan';
  const headerBg = isIncome ? 'bg-[#C8F5C8]' : 'bg-red-200';
  const badgeColor = isIncome ? 'bg-green-600' : 'bg-red-600';
  const amountColor = isIncome ? 'text-green-700' : 'text-red-700';

  const isOwner = (transaction) => transaction.user_id === currentUserId;
  const canEdit = (transaction) => transaction.can_edit && isOwner(transaction);
  const canDelete = (transaction) => transaction.can_delete && isOwner(transaction);

  const renderMobileRow = (transaction) => (
    <tr key={transaction.id} className="hover:bg-yellow-50 transition-colors border-b border-black last:border-b-0">
      <td className="px-5 py-3 text-sm font-bold text-black">
        <div>{formatDate(transaction.waktu_transaksi)}</div>
        {isOwner(transaction) && (
          <span className="inline-block mt-1 text-xs bg-[#7c98ff] text-black px-2 py-0.5 rounded-full font-black border border-black">
            Anda
          </span>
        )}
      </td>
      <td className={`px-5 py-3 text-sm font-black ${amountColor}`}>
        {formatCurrency(transaction.jumlah)}
      </td>
      <td className="px-5 py-3 text-right">
        <button
          onClick={() => onShowDetail(transaction)}
          className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          title="Lihat Detail"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </td>
    </tr>
  );

  const renderDesktopRow = (transaction) => {
    const hasActions = canEdit(transaction) || canDelete(transaction);
    return (
      <tr key={transaction.id} className="hover:bg-yellow-50 transition-colors border-b border-black last:border-b-0">
        <td className="px-5 py-3 text-sm font-bold text-black whitespace-nowrap">
          {formatDate(transaction.waktu_transaksi)}
        </td>
        <td className={`px-5 py-3 text-sm font-black whitespace-nowrap ${amountColor}`}>
          {formatCurrency(transaction.jumlah)}
        </td>
        <td className="px-5 py-3 text-sm text-black font-medium">
          {transaction.catatan || <span className="text-black/40 italic">-</span>}
        </td>
        <td className="px-5 py-3 text-sm whitespace-nowrap">
          {transaction.bukti_url ? (
            <button
              onClick={() => onPreviewBukti(transaction)}
              className="px-3 py-1 rounded-full border-2 border-black bg-pink-200 text-black font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-pink-300 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              Lihat Bukti
            </button>
          ) : (
            <span className="text-black/40">-</span>
          )}
        </td>
        <td className="px-5 py-3 text-sm text-black whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className="font-bold">{transaction.user ? transaction.user.name : transaction.user_name || '-'}</span>
            {isOwner(transaction) && (
              <span className="text-xs bg-[#7c98ff] text-black px-2 py-0.5 rounded-full font-black border border-black">
                Anda
              </span>
            )}
          </div>
        </td>
        <td className="px-5 py-3 text-right whitespace-nowrap">
          {hasActions ? (
            <div className="flex justify-end gap-2">
              {canEdit(transaction) && (
                <button
                  onClick={() => onEdit(transaction)}
                  className="px-3 py-1 rounded-full border-2 border-black bg-[#7c98ff] text-black font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-[#6a88fc] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Edit
                </button>
              )}
              {canDelete(transaction) && (
                <button
                  onClick={() => onDelete(transaction)}
                  className="px-3 py-1 rounded-full border-2 border-black bg-red-300 text-black font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-red-400 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Hapus
                </button>
              )}
            </div>
          ) : (
            <span className="text-black/30 text-xs">-</span>
          )}
        </td>
      </tr>
    );
  };

  const renderPagination = () => {
    if (!data || !data.links) return null;
    return (
      <div className="flex items-center justify-between mt-4 px-5 pb-4">
        <div className="text-xs font-bold text-black/60">
          Menampilkan {data.from || 0} – {data.to || 0} dari {data.total || 0} transaksi
        </div>
        <div className="flex gap-2">
          {data.links.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                if (link.url && selectedRelationId) {
                  router.get(link.url, { search: searchTerm }, { preserveState: true, preserveScroll: true });
                }
              }}
              disabled={!link.url}
              className={`px-3 py-1 rounded-full text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all ${
                link.active
                  ? 'bg-[#C8F5C8] text-black'
                  : link.url
                  ? 'bg-white text-black hover:bg-gray-100 active:shadow-none active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-gray-200 text-black/40 cursor-not-allowed opacity-50 shadow-none'
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-black mb-6 shadow-[4px_4px_0px_0px_#000] overflow-hidden">
      {/* Table Header */}
      <div className={`${headerBg} px-5 py-4 border-b-2 border-black flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-full ${badgeColor} border-2 border-black flex items-center justify-center`}>
            {isIncome ? (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
          </div>
          <h2 className="text-base font-black text-black uppercase tracking-wide">{title}</h2>
        </div>
        {data?.total > 0 && (
          <span className="text-xs font-black bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#000]">
            {data.total} transaksi
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-black">
            {isMobile ? (
              <tr>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Tanggal</th>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Jumlah</th>
                <th className="px-5 py-3 text-right text-xs font-black text-black uppercase tracking-widest">Detail</th>
              </tr>
            ) : (
              <tr>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Tanggal</th>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Jumlah</th>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Catatan</th>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Bukti</th>
                <th className="px-5 py-3 text-left text-xs font-black text-black uppercase tracking-widest">Pembuat</th>
                <th className="px-5 py-3 text-right text-xs font-black text-black uppercase tracking-widest">Aksi</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data?.data?.length > 0 ? (
              data.data.map((transaction) =>
                isMobile ? renderMobileRow(transaction) : renderDesktopRow(transaction)
              )
            ) : (
              <tr>
                <td colSpan={isMobile ? "3" : "6"} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-black/40">
                    <div className="w-14 h-14 rounded-2xl border-2 border-black/20 bg-gray-100 flex items-center justify-center mb-3">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-black">Tidak ada data {type}</p>
                    <p className="text-xs mt-1 font-medium">Mulai tambahkan transaksi pertama Anda</p>
                  </div>
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
