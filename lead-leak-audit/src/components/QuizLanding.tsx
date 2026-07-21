type QuizLandingProps = {
  onStart: () => void;
};

export function QuizLanding({ onStart }: QuizLandingProps) {
  return (
    <section className="animate-fade-up flex min-h-[100dvh] flex-col justify-center px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <p className="mb-5 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[var(--brand)]">
          Fluence
        </p>
        <h1 className="font-display text-[2.35rem] leading-[1.08] tracking-[-0.03em] text-[var(--text)] sm:text-[3.1rem]">
          Lead Leak Audit
        </h1>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[var(--text-secondary)]">
          Seven questions. Two minutes. Find out where your coaching leads are
          quietly slipping through the cracks.
        </p>
        <button type="button" className="btn-primary mt-10" onClick={onStart}>
          Start the Audit
        </button>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          No fluff. Just a clear read on your follow-up system.
        </p>
      </div>
    </section>
  );
}
