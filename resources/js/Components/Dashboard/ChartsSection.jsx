// resources/js/Components/Dashboard/ChartsSection.jsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { BarChart3, Users, Sparkles, Folder } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_#000] text-xs">
        <p className="font-black text-black text-sm mb-1.5">{label} {data.year || ''}</p>
        <div className="space-y-1">
          <p className="font-bold text-green-700 flex justify-between gap-3">
            <span>Pemasukan:</span>
            <span className="font-black">Rp {(data.pemasukan || 0).toLocaleString('id-ID')}</span>
          </p>
          <p className="font-bold text-red-600 flex justify-between gap-3">
            <span>Pengeluaran:</span>
            <span className="font-black">Rp {(data.pengeluaran || 0).toLocaleString('id-ID')}</span>
          </p>
          <div className="border-t border-black/20 pt-1 mt-1 font-black text-black flex justify-between gap-3">
            <span>Arus Kas:</span>
            <span>Rp {(data.value || 0).toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartsSection({
  areaData = [],
  chartStats = {},
  relationBreakdown = []
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-7">

      {/* Overview Chart Card */}
      <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black bg-[#7c98ff] shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <BarChart3 className="text-black stroke-[2.5]" size={20} />
          </div>
          <div>
            <h3 className="text-base font-black text-black">Tren Arus Kas (6 Bulan Terakhir)</h3>
            <p className="text-xs font-bold text-black/60">Perputaran pemasukan & pengeluaran grup</p>
          </div>
        </div>

        {/* Area Chart */}
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorNb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c98ff" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#7c98ff" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="#000000"
                tick={{ fontSize: 11, fill: '#000000', fontWeight: 'bold', fontFamily: 'Nunito' }}
                axisLine={{ stroke: '#000000', strokeWidth: 1.5 }}
                tickLine={false}
              />
              <YAxis
                stroke="#000000"
                tick={{ fontSize: 10, fill: '#000000', fontWeight: 'bold', fontFamily: 'Nunito' }}
                axisLine={{ stroke: '#000000', strokeWidth: 1.5 }}
                tickLine={false}
                width={50}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`;
                  return val;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#000000"
                strokeWidth={3}
                fill="url(#colorNb)"
                dot={{ r: 4, fill: '#7c98ff', stroke: '#000000', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#FDBB4E', stroke: '#000000', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Mulai Tanggal", value: chartStats.start_date || "-", bg: '#FFFFFF' },
            { label: "Total Transaksi", value: (chartStats.total_transaksi ?? 0).toLocaleString('id-ID'), bg: '#c5ffbc' },
            { label: "Rata-Rata Trx", value: chartStats.avg_transaksi || "Rp 0", bg: '#FDBB4E' },
          ].map((s, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_#000]"
              style={{ background: s.bg }}
            >
              <p className="text-[10px] font-black text-black/70 mb-0.5 uppercase tracking-wider">{s.label}</p>
              <p className="text-xs sm:text-sm font-black text-black truncate">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hubungan Grup Breakdown Card */}
      <div className="bg-white border-2 border-black rounded-2xl p-5 md:p-6 shadow-[4px_4px_0px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-black bg-[#FDBB4E] shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
              <Users className="text-black stroke-[2.5]" size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-black">Distribusi Hubungan Grup</h3>
              <p className="text-xs font-bold text-black/60">Aktivitas keuangan per grup</p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full border-2 border-black bg-[#c5ffbc] text-black shadow-[2px_2px_0px_0px_#000]">
            Tahun {currentYear}
          </span>
        </div>

        {/* Breakdown list */}
        {relationBreakdown && relationBreakdown.length > 0 ? (
          <div className="space-y-3.5 overflow-y-auto max-h-[260px] pr-1">
            {relationBreakdown.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-black font-black text-[11px] text-black shadow-[1px_1px_0px_0px_#000] flex-shrink-0"
                      style={{ background: item.color }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-black text-black truncate">{item.name}</span>
                    <span className="text-[10px] font-bold text-black/50 font-mono hidden sm:inline">({item.kode})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-shrink-0">
                    <span className="font-black text-black">{item.formatted_value}</span>
                    <span
                      className="font-black px-2 py-0.5 rounded-full border border-black text-black text-[11px] shadow-[1px_1px_0px_0px_#000]"
                      style={{ background: item.color }}
                    >
                      {item.percent}%
                    </span>
                  </div>
                </div>
                {/* Progress bar container */}
                <div className="w-full rounded-full h-3 border-2 border-black bg-gray-100 overflow-hidden shadow-[1px_1px_0px_0px_#000]">
                  <div
                    className="h-full rounded-full border-r border-black transition-all duration-700"
                    style={{
                      width: `${Math.max(item.percent, item.value > 0 ? 5 : 0)}%`,
                      background: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-yellow-50 border-2 border-black rounded-xl p-4">
            <Folder className="w-10 h-10 mx-auto mb-2 text-black/40 stroke-[2]" />
            <p className="text-black font-black text-sm mb-1">Belum ada hubungan grup</p>
            <p className="text-black/60 font-bold text-xs">
              Buat atau gabung ke hubungan baru untuk melihat statistik aktivitasnya
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
