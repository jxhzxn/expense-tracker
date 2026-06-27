interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  featured?: boolean;
}

export default function StatCard({ label, value, sub, accent, featured }: Props) {
  if (featured) {
    return (
      <div
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "var(--c-featured-bg)",
          boxShadow: "var(--c-shadow)",
          border: "1px solid rgba(255, 204, 0, 0.25)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--c-t2)" }}>{label}</p>
        <p className="text-2xl font-bold mt-1.5 tracking-tight" style={{ color: "var(--c-featured-text)" }}>{value}</p>
        {sub && <p className="text-xs mt-1.5" style={{ color: "var(--c-t3)" }}>{sub}</p>}
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: accent ? "var(--c-accent-bg)" : "var(--c-card)",
        boxShadow: accent ? "none" : "var(--c-shadow)",
        border: accent ? "1px solid var(--c-accent-border)" : "1px solid var(--c-card-outline)",
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
