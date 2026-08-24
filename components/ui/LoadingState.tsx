export function LoadingState({ label = "読み込み中です…" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 text-secondary"
      role="status"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
