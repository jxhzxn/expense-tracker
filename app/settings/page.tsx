"use client";

import { useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  getCategories, saveCategories,
  exportAllData, importAllData, clearAllData,
} from "@/lib/storage";
import { getCategoryColor } from "@/lib/utils";

// ── Shared card wrapper ───────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        backgroundColor: "var(--c-card)",
        boxShadow: "var(--c-shadow)",
        border: "1px solid var(--c-card-outline)",
      }}
    >
      <h2 className="text-sm font-semibold mb-5" style={{ color: "var(--c-t2)" }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={{ borderTop: "1px solid var(--c-card-outline)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--c-t1)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--c-t3)" }}>{description}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Appearance ────────────────────────────────────────────────
function AppearanceSection() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <Section title="Appearance">
      <Row label="Dark mode" description="Switch between light and dark theme">
        <button
          role="switch"
          aria-checked={isDark}
          onClick={toggle}
          className="relative flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]/50"
          style={{
            width: 44,
            height: 26,
            backgroundColor: isDark ? "#FFCC00" : "var(--c-input-border)",
          }}
        >
          <span
            className="absolute rounded-full bg-white shadow transition-transform duration-200 ease-in-out"
            style={{
              width: 20,
              height: 20,
              top: 3,
              left: 3,
              transform: isDark ? "translateX(18px)" : "translateX(0)",
            }}
          />
        </button>
      </Row>
    </Section>
  );
}

// ── Categories ────────────────────────────────────────────────
function CategoriesSection() {
  const [categories, setCategories] = useState<string[]>(() => getCategories());
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) { setError("Enter a category name."); return; }
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError("Category already exists."); return;
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
    <Section title="Categories">
      <div className="space-y-1 mb-4">
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
          <p className="text-sm text-center py-4" style={{ color: "var(--c-t3)" }}>No categories yet.</p>
        )}
      </div>

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
    </Section>
  );
}

// ── Data ──────────────────────────────────────────────────────
function DataSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [importError, setImportError] = useState("");

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `expense-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setImportError("");
    e.target.value = "";
  }

  function confirmImport() {
    if (!pendingFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAllData(reader.result as string);
        window.location.reload();
      } catch {
        setImportError("Invalid backup file. Make sure it was exported from this app.");
        setPendingFile(null);
      }
    };
    reader.readAsText(pendingFile);
  }

  return (
    <>
      <Section title="Data">
        <Row label="Export backup" description="Download all your data as a JSON file">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)] flex-shrink-0"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </Row>
        <Row label="Import backup" description="Restore data from a previously exported file">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)] flex-shrink-0"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Import
          </button>
        </Row>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
      </Section>

      {/* Import confirmation modal */}
      {pendingFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && setPendingFile(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}
          >
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Import backup?</h2>
            <p className="text-sm mb-1" style={{ color: "var(--c-t2)" }}>
              File: <span className="font-medium">{pendingFile.name}</span>
            </p>
            <p className="text-sm mb-5" style={{ color: "var(--c-t3)" }}>
              This will replace all current data including expenses, income, transfers, and categories.
            </p>
            {importError && <p className="text-red-500 text-sm mb-4">{importError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setPendingFile(null); setImportError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]"
                style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-500"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Danger zone ───────────────────────────────────────────────
function DangerSection() {
  const [step, setStep] = useState<"idle" | "warn" | "confirm">("idle");

  function handleReset() {
    clearAllData();
    window.location.reload();
  }

  return (
    <>
      <Section title="Danger Zone">
        <Row label="Reset all data" description="Permanently delete all expenses, income, transfers, and categories">
          <button
            onClick={() => setStep("warn")}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0 text-red-500 hover:bg-red-500/10"
            style={{ border: "1px solid rgba(239,68,68,0.4)" }}
          >
            Reset
          </button>
        </Row>
      </Section>

      {step === "warn" && (
        <ConfirmModal onClose={() => setStep("idle")}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Reset all data?</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--c-t2)" }}>
            This will permanently delete all your <strong style={{ color: "var(--c-t1)" }}>expenses, income entries, and transfers</strong>. Your account balances will return to zero.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setStep("idle")} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]" style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}>Cancel</button>
            <button onClick={() => setStep("confirm")} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">Yes, continue</button>
          </div>
        </ConfirmModal>
      )}

      {step === "confirm" && (
        <ConfirmModal onClose={() => setStep("idle")}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.18)" }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Are you absolutely sure?</h2>
          <p className="text-sm mb-1 leading-relaxed" style={{ color: "var(--c-t2)" }}>There is <strong style={{ color: "var(--c-t1)" }}>no way to recover</strong> your data once it's deleted.</p>
          <p className="text-sm mb-6" style={{ color: "var(--c-t3)" }}>This is your last chance to cancel.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep("idle")} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]" style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}>Cancel</button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Delete everything
            </button>
          </div>
        </ConfirmModal>
      )}
    </>
  );
}

function ConfirmModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}>
        {children}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-[var(--c-t1)] mb-6 max-w-2xl mx-auto">Settings</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        <AppearanceSection />
        <CategoriesSection />
        <DataSection />
        <DangerSection />
      </div>
    </>
  );
}
