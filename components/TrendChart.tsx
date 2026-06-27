"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { month: string; income: number; expense: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg px-3 py-2 text-sm shadow-lg border" style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}>
        <p className="text-[var(--c-t2)] mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
        {payload.length === 2 && (
          <p className="text-[var(--c-t3)] text-xs mt-1 border-t border-[var(--c-border)] pt-1">
            Net: {formatCurrency(payload[0].value - payload[1].value)}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--c-t3)] text-sm">
        No data yet — add income and expenses to see the trend
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--c-border)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "var(--c-t2)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--c-t2)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `RM${v}`} width={60} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Legend formatter={(value) => <span className="text-[var(--c-t2)] text-xs capitalize">{value}</span>} />
        <Bar dataKey="income"  name="Income"   fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" name="Expenses" fill="#FFCC00" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
