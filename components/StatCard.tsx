interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: accent ? "var(--c-accent-bg)" : "var(--c-card)",
        boxShadow: accent ? "none" : "var(--c-shadow)",
        border: accent ? "1px solid var(--c-accent-border)" : "none",
      }}
    >
      <p className="text-sm font-medium" style={{ color: "var(--c-t2)" }}>{label}</p>
      <p
        className="text-2xl font-bold mt-1.5 tracking-tight"
        style={{ color: accent ? "var(--c-accent-text)" : "var(--c-t1)" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs mt-1.5" style={{ color: "var(--c-t3)" }}>{sub}</p>}
    </div>
  );
}
