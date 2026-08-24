interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;

  return (
    <div className="flex items-center gap-3" role="group" aria-label="進行状況">
      <span className="text-sm font-semibold text-secondary whitespace-nowrap">
        {label ?? "確認"} {current} / {total}
      </span>
      <div
        className="h-1.5 flex-1 rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div
          className="h-1.5 rounded-full bg-accent transition-[width] duration-200"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
