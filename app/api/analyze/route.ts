import Anthropic from "@anthropic-ai/sdk";

interface AnalysisPayload {
  period: string;
  totalExpenses: number;
  totalIncome: number;
  days: number;
  dailyAvg: number;
  categoryBreakdown: { name: string; value: number }[];
  topExpenses: { note: string; amount: number; category: string; date: string }[];
  accountBalances: Record<string, number>;
}

function buildPrompt(data: AnalysisPayload): string {
  const fmt = (n: number) => `RM ${n.toFixed(2)}`;

  const categories = data.categoryBreakdown
    .map((c) => {
      const pct = data.totalExpenses > 0 ? ((c.value / data.totalExpenses) * 100).toFixed(0) : "0";
      return `  • ${c.name}: ${fmt(c.value)} (${pct}%)`;
    })
    .join("\n");

  const topItems = data.topExpenses
    .slice(0, 5)
    .map((e) => `  • ${e.date} — ${e.note || e.category} [${e.category}]: ${fmt(e.amount)}`)
    .join("\n");

  const balances = Object.entries(data.accountBalances)
    .map(([acc, bal]) => `  • ${acc}: ${fmt(bal)}`)
    .join("\n");

  return `You are a concise personal finance assistant. Analyze this spending data and provide practical insights.

Period: ${data.period} (${data.days} days)
Total Expenses: ${fmt(data.totalExpenses)}
Total Income: ${fmt(data.totalIncome)}
Daily Average: ${fmt(data.dailyAvg)}
Net: ${fmt(data.totalIncome - data.totalExpenses)}

Spending by Category:
${categories || "  (no expenses)"}

Top Expenses:
${topItems || "  (none)"}

Account Balances:
${balances}

Provide a brief analysis with:
1. **Summary** — 1-2 sentences on overall financial health for this period
2. **Key Observations** — 2-3 bullet points highlighting notable patterns or concerns
3. **Suggestions** — 2-3 actionable tips to optimize spending

Keep it concise, friendly, and specific to the data above. Use RM for currency. Avoid generic advice.`;
}

export async function POST(req: Request) {
  const data: AnalysisPayload = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY is not set", { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey });

  const stream = anthropic.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{ role: "user", content: buildPrompt(data) }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
