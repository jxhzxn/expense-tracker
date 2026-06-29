"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import {
  getCategories, saveCategories, DEFAULT_CATEGORIES,
  exportSettings, importSettings,
  exportData, importData,
  clearSettings, clearDataInRange,
  getAccountConfigs, saveAccountConfigs,
  getExpenses, getIncomes, getTransfers,
} from "@/lib/storage";
import { getCategoryColor } from "@/lib/utils";
import { ACCOUNTS, ACCOUNT_DESC, AccountType, AccountConfig, DEFAULT_ACCOUNT_CONFIGS } from "@/lib/types";
import AccountIcon, { ICON_KEYS, ICON_LABELS } from "@/components/AccountIcon";

// ── Date helpers ──────────────────────────────────────────────
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayStr() { return toDateStr(new Date()); }
function thisWeekRange() {
  const now = new Date();
  const toMon = now.getDay() === 0 ? -6 : 1 - now.getDay();
  const mon = new Date(now); mon.setDate(now.getDate() + toMon);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { start: toDateStr(mon), end: toDateStr(sun) };
}
function thisMonthRange() {
  const now = new Date();
  return {
    start: toDateStr(new Date(now.getFullYear(), now.getMonth(), 1)),
    end:   toDateStr(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  };
}

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
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  useEffect(() => { setCategories(getCategories()); }, []);
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

// ── Shared backup card ────────────────────────────────────────
function BackupCard({
  title, description,
  exportFn, exportLabel,
  importFn, importLabel,
}: {
  title: string; description: string;
  exportFn: () => string; exportLabel: string;
  importFn: (json: string) => void; importLabel: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<File | null>(null);
  const [error, setError] = useState("");

  function handleExport() {
    const today = toDateStr(new Date());
    const json = exportFn();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${exportLabel}-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(file);
    setError("");
    e.target.value = "";
  }

  function confirmImport() {
    if (!pending) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importFn(reader.result as string);
        window.location.reload();
      } catch {
        setError("Invalid file. Make sure it was exported from this app.");
        setPending(null);
      }
    };
    reader.readAsText(pending);
  }

  return (
    <>
      <Section title={title}>
        <p className="text-xs mb-4 -mt-2" style={{ color: "var(--c-t3)" }}>{description}</p>
        <Row label="Export" description={`Download ${title.toLowerCase()} as a JSON file`}>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)] flex-shrink-0"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            Export
          </button>
        </Row>
        <Row label="Import" description={`Restore ${title.toLowerCase()} from a previously exported file`}>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)] flex-shrink-0"
            style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Import
          </button>
        </Row>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileChange} />
      </Section>

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && setPending(null)}
        >
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Import {title.toLowerCase()}?</h2>
            <p className="text-sm mb-1" style={{ color: "var(--c-t2)" }}>File: <span className="font-medium">{pending.name}</span></p>
            <p className="text-sm mb-5" style={{ color: "var(--c-t3)" }}>This will replace your current {title.toLowerCase()}. This cannot be undone.</p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => { setPending(null); setError(""); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]" style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}>Cancel</button>
              <button onClick={confirmImport} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-500">Import</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Accounts ──────────────────────────────────────────────────
const PRESET_COLORS = [
  "#22c55e", "#3b82f6", "#f97316", "#a855f7",
  "#ec4899", "#eab308", "#06b6d4", "#ef4444",
  "#6366f1", "#14b8a6", "#f59e0b", "#6b7280",
];

function AccountsSection() {
  const [configs, setConfigs] = useState<Record<AccountType, AccountConfig>>(DEFAULT_ACCOUNT_CONFIGS);
  useEffect(() => { setConfigs(getAccountConfigs()); }, []);
  const [open, setOpen] = useState<AccountType | null>(null);

  function update(account: AccountType, patch: Partial<AccountConfig>) {
    const next = { ...configs, [account]: { ...configs[account], ...patch } };
    setConfigs(next);
    saveAccountConfigs(next);
  }

  function toggle(account: AccountType) {
    setOpen((prev) => (prev === account ? null : account));
  }

  return (
    <Section title="Accounts">
      {ACCOUNTS.map((account, i) => {
        const cfg = configs[account];
        const isOpen = open === account;
        return (
          <div key={account}>
            <div
              className="flex items-center gap-3 py-3"
              style={i > 0 ? { borderTop: "1px solid var(--c-card-outline)" } : undefined}
            >
              {/* Icon button */}
              <button
                onClick={() => toggle(account)}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-80"
                style={{ backgroundColor: `${cfg.color}20` }}
                title="Change icon or color"
              >
                <AccountIcon icon={cfg.icon} color={cfg.color} size={18} />
              </button>

              {/* Name + desc */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--c-t1)" }}>{account}</p>
                <p className="text-xs truncate" style={{ color: "var(--c-t3)" }}>{ACCOUNT_DESC[account]}</p>
              </div>

              {/* Color swatch */}
              <button
                onClick={() => toggle(account)}
                className="w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-offset-2 transition-all hover:scale-110"
                style={{
                  backgroundColor: cfg.color,
                  outline: isOpen ? `2px solid ${cfg.color}` : "2px solid transparent",
                  outlineOffset: 2,
                }}
                title="Change color"
              />
            </div>

            {/* Expanded editor */}
            {isOpen && (
              <div
                className="mb-3 rounded-xl p-4 space-y-4"
                style={{ backgroundColor: "var(--c-subtle, var(--c-input))", border: "1px solid var(--c-card-outline)" }}
              >
                {/* Icon grid */}
                <div>
                  <p className="text-xs font-medium mb-2.5" style={{ color: "var(--c-t3)" }}>Icon</p>
                  <div className="grid grid-cols-6 gap-2">
                    {ICON_KEYS.map((key) => {
                      const active = cfg.icon === key;
                      return (
                        <button
                          key={key}
                          onClick={() => update(account, { icon: key })}
                          title={ICON_LABELS[key]}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                          style={{
                            backgroundColor: active ? `${cfg.color}25` : "var(--c-card)",
                            border: active ? `1.5px solid ${cfg.color}` : "1.5px solid transparent",
                          }}
                        >
                          <AccountIcon icon={key} color={active ? cfg.color : "var(--c-t3)"} size={17} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color presets + custom */}
                <div>
                  <p className="text-xs font-medium mb-2.5" style={{ color: "var(--c-t3)" }}>Color</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map((color) => {
                      const active = cfg.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => update(account, { color })}
                          className="w-7 h-7 rounded-full transition-all hover:scale-110"
                          style={{
                            backgroundColor: color,
                            outline: active ? `2px solid ${color}` : "2px solid transparent",
                            outlineOffset: 2,
                          }}
                        />
                      );
                    })}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs" style={{ color: "var(--c-t3)" }}>Custom</span>
                    <input
                      type="color"
                      value={cfg.color}
                      onChange={(e) => update(account, { color: e.target.value })}
                      className="h-7 w-14 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Section>
  );
}

// ── Danger zone ───────────────────────────────────────────────
type RangeType = "week" | "month" | "custom";

function DangerSection() {
  // ── Settings reset ──
  const [settingsModal, setSettingsModal] = useState(false);

  // ── Data reset ──
  const [dataOpen, setDataOpen]   = useState(false);
  const [rangeType, setRangeType] = useState<RangeType>("month");
  const [custStart, setCustStart] = useState(todayStr);
  const [custEnd,   setCustEnd]   = useState(todayStr);
  const [dataModal, setDataModal] = useState(false);

  const range = useMemo(() => {
    if (rangeType === "week")   return thisWeekRange();
    if (rangeType === "month")  return thisMonthRange();
    return { start: custStart, end: custEnd };
  }, [rangeType, custStart, custEnd]);

  const affected = useMemo(() => {
    if (!dataOpen) return { e: 0, i: 0, t: 0 };
    const { start, end } = range;
    const inRange = (d: string) => d >= start && d <= end;
    return {
      e: getExpenses().filter((x) => inRange(x.date)).length,
      i: getIncomes().filter((x) => inRange(x.date)).length,
      t: getTransfers().filter((x) => inRange(x.date)).length,
    };
  }, [dataOpen, range]);
  const totalAffected = affected.e + affected.i + affected.t;

  const rangeLabel = rangeType === "week"
    ? "this week"
    : rangeType === "month"
    ? "this month"
    : `${range.start} – ${range.end}`;

  const inputClass = "flex-1 bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-2 text-sm text-[var(--c-t1)] focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 transition-colors";

  return (
    <>
      <Section title="Danger Zone">
        {/* Reset Settings */}
        <Row label="Reset settings" description="Restore categories, account colors/icons, and theme to defaults">
          <button
            onClick={() => setSettingsModal(true)}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0 text-red-500 hover:bg-red-500/10"
            style={{ border: "1px solid rgba(239,68,68,0.4)" }}
          >
            Reset
          </button>
        </Row>

        {/* Reset Data */}
        <Row label="Reset data" description="Delete expenses, income, and transfers for a selected period">
          <button
            onClick={() => setDataOpen((v) => !v)}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-colors flex-shrink-0 text-red-500 hover:bg-red-500/10"
            style={{ border: "1px solid rgba(239,68,68,0.4)" }}
          >
            {dataOpen ? "Cancel" : "Reset"}
          </button>
        </Row>

        {/* Inline range picker */}
        {dataOpen && (
          <div className="mt-1 mb-2 rounded-xl p-4 space-y-4" style={{ backgroundColor: "var(--c-input)", border: "1px solid var(--c-card-outline)" }}>
            {/* Range tabs */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--c-t3)" }}>Period</p>
              <div className="flex gap-1.5">
                {(["week", "month", "custom"] as RangeType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRangeType(r)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                    style={
                      rangeType === r
                        ? { backgroundColor: "#FFCC00", color: "#1a1200" }
                        : { backgroundColor: "var(--c-card)", color: "var(--c-t2)", border: "1px solid var(--c-card-outline)" }
                    }
                  >
                    {r === "week" ? "This Week" : r === "month" ? "This Month" : "Custom Range"}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom date inputs */}
            {rangeType === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={custStart} onChange={(e) => setCustStart(e.target.value)} className={inputClass} />
                <span className="text-sm flex-shrink-0" style={{ color: "var(--c-t3)" }}>to</span>
                <input type="date" value={custEnd} onChange={(e) => setCustEnd(e.target.value)} className={inputClass} />
              </div>
            )}

            {/* Count preview */}
            <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: "var(--c-card)", border: "1px solid var(--c-card-outline)" }}>
              {totalAffected === 0 ? (
                <p className="text-sm" style={{ color: "var(--c-t3)" }}>No records found for {rangeLabel}.</p>
              ) : (
                <p className="text-sm" style={{ color: "var(--c-t1)" }}>
                  <strong>{totalAffected} record{totalAffected !== 1 ? "s" : ""}</strong> will be deleted for {rangeLabel}
                  <span style={{ color: "var(--c-t3)" }}>
                    {" "}({affected.e} expense{affected.e !== 1 ? "s" : ""}
                    {affected.i > 0 ? `, ${affected.i} income` : ""}
                    {affected.t > 0 ? `, ${affected.t} transfer${affected.t !== 1 ? "s" : ""}` : ""})
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={() => totalAffected > 0 && setDataModal(true)}
              disabled={totalAffected === 0}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => { if (totalAffected > 0) e.currentTarget.style.backgroundColor = "#b91c1c"; }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Delete {totalAffected} record{totalAffected !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </Section>

      {/* Settings reset confirm */}
      {settingsModal && (
        <ConfirmModal onClose={() => setSettingsModal(false)}>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Reset settings?</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--c-t2)" }}>
            This will restore your <strong style={{ color: "var(--c-t1)" }}>categories, account icons/colors, and theme</strong> to their defaults. Your financial data is not affected.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setSettingsModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]" style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}>Cancel</button>
            <button
              onClick={() => { clearSettings(); window.location.reload(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Reset settings
            </button>
          </div>
        </ConfirmModal>
      )}

      {/* Data delete confirm */}
      {dataModal && (
        <ConfirmModal onClose={() => setDataModal(false)}>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Delete {totalAffected} records?</h2>
          <p className="text-sm mb-1" style={{ color: "var(--c-t2)" }}>
            Period: <strong style={{ color: "var(--c-t1)" }}>{range.start} – {range.end}</strong>
          </p>
          <p className="text-sm mb-5" style={{ color: "var(--c-t3)" }}>This cannot be undone. There is no way to recover deleted records.</p>
          <div className="flex gap-3">
            <button onClick={() => setDataModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]" style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}>Cancel</button>
            <button
              onClick={() => { clearDataInRange(range.start, range.end); window.location.reload(); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Delete records
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
        <AccountsSection />
        <CategoriesSection />
        <BackupCard
          title="Settings Backup"
          description="Theme, categories, account colors &amp; icons, and balance adjustments."
          exportFn={exportSettings}
          exportLabel="settings-backup"
          importFn={importSettings}
          importLabel="settings"
        />
        <BackupCard
          title="Data Backup"
          description="All expenses, income entries, and transfers."
          exportFn={exportData}
          exportLabel="data-backup"
          importFn={importData}
          importLabel="data"
        />
        <DangerSection />
      </div>
    </>
  );
}
