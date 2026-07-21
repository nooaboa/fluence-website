type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[0.72rem] font-medium tracking-[0.06em] uppercase text-[var(--text-muted)]">
        <span>
          Question {current} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--track)]"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
