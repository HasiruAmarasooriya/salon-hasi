"use client";

export function PrintReceiptButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="mb-6 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white print:hidden"
    >
      Print receipt
    </button>
  );
}
