export type RangeMode = "week" | "payperiod" | "lastperiod" | "custom";

export interface DateRange {
  start: string;
  end: string;
  label: string;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function fmt(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function payPeriodDates(ref: Date): { start: string; end: string } {
  const d = ref.getDate();
  const y = ref.getFullYear();
  const m = ref.getMonth();
  if (d >= 25) {
    return {
      start: toDateStr(new Date(y, m, 25)),
      end: toDateStr(new Date(y, m + 1, 24)),
    };
  }
  return {
    start: toDateStr(new Date(y, m - 1, 25)),
    end: toDateStr(new Date(y, m, 24)),
  };
}

export function getRangeForMode(
  mode: RangeMode,
  customStart?: string,
  customEnd?: string
): DateRange {
  const today = new Date();

  if (mode === "week") {
    const dow = today.getDay();
    const diff = dow === 0 ? 6 : dow - 1;
    const mon = new Date(today);
    mon.setDate(today.getDate() - diff);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    const start = toDateStr(mon);
    const end = toDateStr(sun);
    return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
  }

  if (mode === "payperiod") {
    const { start, end } = payPeriodDates(today);
    return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
  }

  if (mode === "lastperiod") {
    const cur = payPeriodDates(today);
    const curStart = new Date(cur.start + "T00:00:00");
    const prevStart = new Date(curStart.getFullYear(), curStart.getMonth() - 1, 25);
    const prevEnd = new Date(curStart.getFullYear(), curStart.getMonth(), 24);
    const start = toDateStr(prevStart);
    const end = toDateStr(prevEnd);
    return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
  }

  const start = customStart ?? toDateStr(today);
  const end = customEnd ?? toDateStr(today);
  return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}
