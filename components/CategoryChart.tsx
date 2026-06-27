"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORY_COLORS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg px-3 py-2 text-sm shadow-lg border"
        style={{ backgroundColor: "var(--c-card)", borderColor: "var(--c-border)" }}
      >
        <p className="text-[var(--c-t1)] font-medium">{payload[0].name}</p>
        <p style={{ color: "var(--c-accent-text)" }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[var(--c-t3)] text-sm">
        No expenses yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] ?? "#6b7280"} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span className="text-[var(--c-t2)] text-xs">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}
