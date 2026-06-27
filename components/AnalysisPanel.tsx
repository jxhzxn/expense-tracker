"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface AnalysisData {
  period: string;
  totalExpenses: number;
  totalIncome: number;
  days: number;
  dailyAvg: number;
  categoryBreakdown: { name: string; value: number }[];
  topExpenses: { note: string; amount: number; category: string; date: string }[];
  accountBalances: Record<string, number>;
}

interface Props {
  data: AnalysisData;
}

type State = "idle" | "loading" | "streaming" | "done" | "error";

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L-1 9l4.5-1.5L5 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: "var(--c-t3)",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

export default function AnalysisPanel({ data }: Props) {
  const [state, setState] = useState<State>("idle");
  const [text, setText]   = useState("");
  const [error, setError] = useState("");

  async function runAnalysis() {
    setState("loading");
    setText("");
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      if (!res.body) throw new Error("No response body");

      setState("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  function renderMarkdown(raw: string) {
    const lines = raw.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={i} className="font-semibold text-[var(--c-t1)] mt-4 first:mt-0">{line.slice(2, -2)}</p>;
      }
      const boldified = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <p key={i} className="text-[var(--c-t2)] text-sm leading-relaxed ml-3"
            dangerouslySetInnerHTML={{ __html: "· " + boldified.slice(2) }} />
        );
      }
      if (line.trim() === "") return <div key={i} className="h-1" />;
      return (
        <p key={i} className="text-[var(--c-t2)] text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: boldified }} />
      );
    });
  }

  return (
    <div
      className="rounded-2xl p-5 mt-6"
      style={{
        backgroundColor: "var(--c-card)",
        boxShadow: "var(--c-shadow)",
        border: "1px solid var(--c-card-outline)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold" style={{ color: "var(--c-t2)" }}>
            AI Analysis
          </h2>
          <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: "var(--c-accent-bg)", color: "var(--c-accent-text)", border: "1px solid var(--c-accent-border)" }}>
            {data.period}
          </span>
        </div>

        {(state === "idle" || state === "done" || state === "error") && (
          <button
            onClick={runAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            style={{ backgroundColor: "#FFCC00", color: "#1a1200" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E6B800")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFCC00")}
          >
            <SparkleIcon />
            {state === "done" ? "Re-analyze" : "Analyze"}
          </button>
        )}

        {state === "loading" && (
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--c-t3)" }}>
            Thinking <LoadingDots />
          </div>
        )}

        {state === "streaming" && (
          <span className="text-xs" style={{ color: "var(--c-t3)" }}>Generating…</span>
        )}
      </div>

      {state === "idle" && (
        <div className="py-8 text-center">
          <p className="text-sm" style={{ color: "var(--c-t3)" }}>
            Get AI-powered insights on your spending for this period.
          </p>
        </div>
      )}

      {(state === "streaming" || state === "done") && text && (
        <div className="space-y-1">{renderMarkdown(text)}</div>
      )}

      {state === "loading" && (
        <div className="py-8 text-center">
          <p className="text-sm" style={{ color: "var(--c-t3)" }}>Analyzing {formatCurrency(data.totalExpenses)} across {data.categoryBreakdown.length} categories…</p>
        </div>
      )}

      {state === "error" && (
        <div className="py-4 text-center">
          <p className="text-sm text-red-500">{error}</p>
          {error.includes("ANTHROPIC_API_KEY") && (
            <p className="text-xs mt-1" style={{ color: "var(--c-t3)" }}>
              Add ANTHROPIC_API_KEY to your .env.local file and restart the dev server.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
