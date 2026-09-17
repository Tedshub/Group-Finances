// resources/js/Components/Relation/GroupSelectorBar.jsx
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Users, ChevronDown, Copy, Check, Plus, ExternalLink } from "lucide-react";

export default function GroupSelectorBar({
  relations = [],
  currentRelation,
  routeBase, // e.g. 'savings.index' | 'budgeting.index' | 'statements.index'
  onSelectRelation, // optional custom handler
  badgeLabel = "Grup Aktif",
  extraAction = null,
}) {
  const [copied, setCopied] = useState(false);

  // Normalize relations array
  const relationList = Array.isArray(relations)
    ? relations
    : relations?.data || [];

  const handleRelationChange = (e) => {
    const newId = e.target.value;
    if (!newId || newId === String(currentRelation?.id)) return;

    if (onSelectRelation) {
      onSelectRelation(newId);
    } else if (routeBase) {
      router.get(route(routeBase, newId));
    }
  };

  const copyCode = () => {
    if (!currentRelation?.kode) return;
    navigator.clipboard.writeText(currentRelation.kode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-black rounded-2xl p-3.5 sm:p-4 mb-6 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Left Side: Label & Select Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#FFFDF0] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
              <Users size={16} className="stroke-[2.5]" />
            </span>
            <label className="text-xs font-black text-black uppercase tracking-wider whitespace-nowrap">
              {badgeLabel}:
            </label>
          </div>

          <div className="relative flex-1 max-w-md">
            <select
              value={currentRelation?.id || ""}
              onChange={handleRelationChange}
              className="w-full appearance-none pl-3.5 pr-10 py-2 bg-[#FFFDF0] border-2 border-black rounded-xl font-black text-sm text-black focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000] cursor-pointer"
            >
              {relationList.map((rel) => (
                <option key={rel.id} value={rel.id}>
                  {rel.nama} ({rel.kode})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-black">
              <ChevronDown size={16} className="stroke-[3]" />
            </div>
          </div>

          {/* Group code badge with quick copy */}
          {currentRelation?.kode && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black bg-gray-50 text-xs font-bold text-gray-700">
              <span>Kode:</span>
              <code className="font-mono font-black text-black">{currentRelation.kode}</code>
              <button
                type="button"
                onClick={copyCode}
                className="p-1 hover:bg-gray-200 rounded transition-colors text-black"
                title="Salin Kode Grup"
              >
                {copied ? <Check size={14} className="text-green-600 stroke-[3]" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Optional Extra Actions / Switch group count */}
        <div className="flex items-center gap-2 justify-end">
          {relationList.length > 1 && (
            <span className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-black rounded-full border border-black bg-[#C8F5C8] shadow-[1px_1px_0px_0px_#000]">
              {relationList.length} Grup
            </span>
          )}

          {extraAction}
        </div>
      </div>
    </div>
  );
}
