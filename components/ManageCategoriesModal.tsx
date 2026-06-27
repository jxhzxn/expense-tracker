"use client";

import { useState } from "react";
import { getCategories, saveCategories } from "@/lib/storage";
import { getCategoryColor } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export default function ManageCategoriesModal({ onClose }: Props) {
  const [categories, setCategories] = useState<string[]>(() => getCategories());
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) { setError("Enter a category name."); return; }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("Category already exists.");
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    saveCategories(updated);
    setNewName("");
    setError("");
  }

  function handleDelete(cat: string) {
    const updated = categories.filter((c) => c !== cat);
    setCategories(updated);
    saveCategories(updated);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col"
        style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)", maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: "var(--c-t1)" }}>Manage Categories</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--c-hover)]"
            style={{ color: "var(--c-t3)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category list */}
        <div className="flex-1 overflow-y-auto space-y-1 mb-5 -mx-1 px-1">
          {categories.map((cat) => {
            const color = getCategoryColor(cat);
            return (
              <div
                key={cat}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl group"
                style={{ backgroundColor: "var(--c-subtle)" }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1 text-sm font-medium" style={{ color: "var(--c-t1)" }}>{cat}</span>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--c-hover-2)]"
                  style={{ color: "var(--c-t3)" }}
                  title={`Delete ${cat}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className="text-sm text-center py-6" style={{ color: "var(--c-t3)" }}>No categories yet.</p>
          )}
        </div>

        {/* Add new */}
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New category name..."
              value={newName}
              onChange={(e) => { setNewName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--c-t1)] placeholder-[var(--c-t3)] focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 transition-colors"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
              style={{ backgroundColor: "#FFCC00", color: "#1a1200" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E6B800")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFCC00")}
            >
              Add
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
        </div>
      </div>
    </div>
  );
}
