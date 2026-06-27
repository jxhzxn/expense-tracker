"use client";

import { useRef, useState } from "react";
import { exportAllData, importAllData } from "@/lib/storage";

export default function DataPortButton() {
  const [open, setOpen]           = useState(false);
  const [confirmImport, setConfirmImport] = useState(false);
  const [pendingFile, setPendingFile]     = useState<File | null>(null);
  const [error, setError]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportAllData();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `expense-tracker-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setConfirmImport(true);
    setError("");
    e.target.value = "";
  }

  function confirmAndImport() {
    if (!pendingFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importAllData(reader.result as string);
        window.location.reload();
      } catch {
        setError("Invalid backup file. Make sure it was exported from this app.");
        setConfirmImport(false);
        setPendingFile(null);
      }
    };
    reader.readAsText(pendingFile);
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1.5 rounded-lg text-[var(--c-t2)] hover:text-[var(--c-t1)] hover:bg-[var(--c-hover)] transition-colors"
          title="Export / Import"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="absolute right-0 top-full mt-1.5 z-50 rounded-xl py-1.5 min-w-[148px]"
              style={{
                backgroundColor: "var(--c-card)",
                boxShadow: "var(--c-shadow-lg)",
                border: "1px solid var(--c-border)",
              }}
            >
              <button
                onClick={handleExport}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-[var(--c-t1)] hover:bg-[var(--c-hover)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export data
              </button>
              <button
                onClick={() => { fileRef.current?.click(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left text-[var(--c-t1)] hover:bg-[var(--c-hover)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Import data
              </button>
            </div>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Import confirmation modal */}
      {confirmImport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ backgroundColor: "var(--c-card)", boxShadow: "var(--c-shadow-lg)" }}
          >
            <h2 className="text-base font-semibold mb-2" style={{ color: "var(--c-t1)" }}>
              Import backup?
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--c-t2)" }}>
              File: <span className="font-medium">{pendingFile?.name}</span>
            </p>
            <p className="text-sm mb-5" style={{ color: "var(--c-t3)" }}>
              This will replace all current data including expenses, income, transfers, and categories. This cannot be undone.
            </p>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmImport(false); setPendingFile(null); setError(""); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--c-hover)]"
                style={{ border: "1px solid var(--c-border)", color: "var(--c-t2)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAndImport}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-500"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
