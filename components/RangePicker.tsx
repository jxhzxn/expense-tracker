"use client";

import { RangeMode } from "@/lib/dateRange";

interface Props {
  mode: RangeMode;
  customStart: string;
  customEnd: string;
  rangeLabel: string;
  onChange: (mode: RangeMode, start?: string, end?: string) => void;
}

const MODES: { key: RangeMode; label: string }[] = [
  { key: "week",       label: "This Week" },
  { key: "payperiod",  label: "Pay Period" },
  { key: "lastperiod", label: "Last Period" },
  { key: "custom",     label: "Custom" },
];

const dateInputClass = "bg-[var(--c-input)] border border-[var(--c-input-border)] rounded-xl px-3 py-1.5 text-sm text-[var(--c-t1)] focus:outline-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/20 transition-colors";

export default function RangePicker({ mode, customStart, customEnd, rangeLabel, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="flex items-center gap-1 rounded-xl p-1"
        style={{ backgroundColor: "var(--c-subtle)", border: "1px solid var(--c-border)" }}
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === m.key
                ? "shadow-sm"
                : "hover:bg-[var(--c-card)]"
            }`}
            style={mode === m.key
              ? { backgroundColor: "#FFCC00", color: "#1a1200" }
              : { color: "var(--c-t2)" }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "custom" ? (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStart}
            max={customEnd}
            onChange={(e) => onChange("custom", e.target.value, customEnd)}
            className={dateInputClass}
          />
          <span className="text-sm" style={{ color: "var(--c-t3)" }}>to</span>
          <input
            type="date"
            value={customEnd}
            min={customStart}
            onChange={(e) => onChange("custom", customStart, e.target.value)}
            className={dateInputClass}
          />
        </div>
      ) : (
        <p className="text-xs pl-1" style={{ color: "var(--c-t3)" }}>{rangeLabel}</p>
      )}
    </div>
  );
}
