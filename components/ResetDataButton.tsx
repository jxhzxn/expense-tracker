"use client";

import { useState } from "react";
import { clearAllData } from "@/lib/storage";

type Step = "closed" | "warn" | "confirm";

export default function ResetDataButton() {
  const [step, setStep] = useState<Step>("closed");

  function handleReset() {
    clearAllData();
    setStep("closed");
    window.location.reload();
  }

  return (
    <>
      {/* Trigger — subtle trash icon in nav */}
      <button
        onClick={() => setStep("warn")}
        title="Reset all data"
        className="p-1.5 rounded-lg transition-colors hover:bg-[var(--c-hover)]"
        style={{ color: "var(--c-t3)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Step 1 — initial warning */}
      {step === "warn" && (
        <Modal onClose={() => setStep("closed")}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.12)" }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Reset all data?</h2>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--c-t2)" }}>
            This will permanently delete all your <strong style={{ color: "var(--c-t1)" }}>expenses, income entries, and transfers</strong>. Your account balances will return to zero.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("closed")}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]"
              style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
            >
              Cancel
            </button>
            <button
              onClick={() => setStep("confirm")}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, continue
            </button>
          </div>
        </Modal>
      )}

      {/* Step 2 — final confirmation */}
      {step === "confirm" && (
        <Modal onClose={() => setStep("closed")}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(239,68,68,0.18)" }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>Are you absolutely sure?</h2>
          <p className="text-sm mb-1 leading-relaxed" style={{ color: "var(--c-t2)" }}>
            There is <strong style={{ color: "var(--c-t1)" }}>no way to recover</strong> your data once it's deleted.
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--c-t3)" }}>This is your last chance to cancel.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("closed")}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]"
              style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors text-white"
              style={{ backgroundColor: "#dc2626" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
            >
              Delete everything
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}
      >
        {children}
      </div>
    </div>
  );
}
