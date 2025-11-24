// resources/js/Components/dashboard/TransactionsList.jsx
import React from "react";

export default function TransactionsList() {
  const transactions = [
    { text: "Salary deposit", amount: "+ Rp 500,000", date: "June 21, 2025", type: "income" },
    { text: "Lunch payment", amount: "- Rp 100,000", date: "June 20, 2025", type: "expense" },
    { text: "Online sales", amount: "+ Rp 250,000", date: "June 19, 2025", type: "income" },
    { text: "Transportation", amount: "- Rp 50,000", date: "June 18, 2025", type: "expense" },
  ];

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm border border-black">
      <h3 className="text-lg font-serif font-semibold text-black mb-4">Recent Transactions</h3>
      <ul className="space-y-3">
        {transactions.map((item, idx) => (
          <li key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
            <div>
              <p className="text-sm font-medium text-black">{item.text}</p>
              <p className="text-xs text-gray-600">{item.date}</p>
            </div>
            <span className={`text-sm font-semibold ${
              item.type === "income" ? "text-[#7c98ff]" : "text-black"
            }`}>
              {item.amount}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
