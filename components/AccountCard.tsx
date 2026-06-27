import { AccountType, ACCOUNT_COLORS, ACCOUNT_DESC } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  account: AccountType;
  balance: number;
}

export default function AccountCard({ account, balance }: Props) {
  const color = ACCOUNT_COLORS[account];
  const isNegative = balance < 0;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow)" }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--c-t1)" }}>{account}</p>
          <p className="text-xs truncate" style={{ color: "var(--c-t3)" }}>{ACCOUNT_DESC[account]}</p>
        </div>
      </div>
      <p className="text-xl font-bold tracking-tight" style={{ color: isNegative ? "#ef4444" : "var(--c-t1)" }}>
        {formatCurrency(balance)}
      </p>
    </div>
  );
}
