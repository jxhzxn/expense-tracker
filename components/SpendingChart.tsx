"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { label: string; total: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-sm shadow-lg border"
        style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}
      >
        <p className="text-[var(--c-t2)]">{label}</p>
        <p className="font-medium" style={{ color: "var(--c-accent-text)" }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--c-t3)] text-sm">
        No expenses yet
      </div>
    );
  }

  const hasMany = data.length > 14;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--c-t2)", fontSize: hasMany ? 10 : 12 }}
          axisLine={false}
          tickLine={false}
          interval={hasMany ? Math.floor(data.length / 7) : 0}
        />
        <YAxis
          tick={{ fill: "var(--c-t2)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `RM${v}`}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
