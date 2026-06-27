interface Props {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        backgroundColor: accent ? "var(--c-accent-bg)" : "var(--c-card)",
        borderColor: accent ? "var(--c-accent-border)" : "var(--c-border)",
      }}
    >
      <p className="text-sm text-[var(--c-t2)]">{label}</p>
      <p
        className="text-2xl font-bold mt-1"
        style={{ color: accent ? "var(--c-accent-text)" : "var(--c-t1)" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-[var(--c-t3)] mt-1">{sub}</p>}
    </div>
  );
}
