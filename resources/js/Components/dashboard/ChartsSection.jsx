// resources/js/Components/dashboard/ChartsSection.jsx
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function ChartsSection() {
  const areaData = [
    { month: "Sep", value: 540000 },
    { month: "Oct", value: 564893 },
    { month: "Nov", value: 584813 },
    { month: "Dec", value: 510000 },
    { month: "Jan", value: 550000 },
    { month: "Feb", value: 530000 },
  ];

  const trafficData = [
    { name: "Approved", value: 1405665, percent: 66.3 },
    { name: "Under review", value: 478540, percent: 32.6 },
    { name: "2bae Verification", value: 239003, percent: 82.0 },
    { name: "Fraudent", value: 237577, percent: 74.6 },
    { name: "Other", value: 566040, percent: 40.1 },
  ];

  const colors = ["#10b981", "#6366f1", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Overview Chart */}
      <div className="bg-gradient-to-br from-[#c5ffbc] to-[#C8F5C8] p-6 rounded-2xl shadow-sm border border-black">
        <div className="mb-4">
          <h3 className="text-lg font-serif font-semibold text-black">Overview</h3>
          <p className="text-xs text-gray-700">Q1·2023 ↔ Q4·2023</p>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c98ff" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#7c98ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c98ff"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div>
            <p className="text-xs text-gray-700">Start date</p>
            <p className="text-sm font-semibold text-black">10.06.2023</p>
          </div>
          <div>
            <p className="text-xs text-gray-700">All time</p>
            <p className="text-sm font-semibold text-black">564893</p>
          </div>
          <div>
            <p className="text-xs text-gray-700">Rating</p>
            <p className="text-sm font-semibold text-[#7c98ff]">+19920</p>
          </div>
        </div>
      </div>

      {/* Traffic Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-black">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-serif font-semibold text-black">Traffic</h3>
            <p className="text-xs text-gray-700">Source on stats</p>
          </div>
          <span className="text-xs text-gray-700">Q4 • 23</span>
        </div>
        <div className="space-y-3">
          {trafficData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[idx] }}
                  />
                  <span className="text-sm text-gray-800">{item.name}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-600">{item.value.toLocaleString()}</span>
                  <span className="text-black font-semibold w-12 text-right">
                    {item.percent}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: colors[idx]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
