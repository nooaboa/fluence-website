import { BOOKING_URL, type Profile } from '../data/profiles';

type ResultScreenProps = {
  profile: Profile;
  totalScore: number;
  firstName: string;
};

export function ResultScreen({ profile, totalScore, firstName }: ResultScreenProps) {
  return (
    <section className="animate-result flex min-h-[100dvh] flex-col justify-center px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.08em] uppercase"
          style={{
            color: profile.accent,
            backgroundColor: profile.accentSoft,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: profile.accent }}
            aria-hidden="true"
          />
          {profile.badgeLabel}
        </div>

        <h1
          className="font-display text-[2.2rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.75rem]"
          style={{ color: 'var(--text)' }}
        >
          <span
            className="block border-b-2 pb-3"
            style={{ borderColor: profile.accent }}
          >
            {profile.headline}
          </span>
        </h1>

        {firstName ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">
            Hey {firstName} — score {totalScore}/21
          </p>
        ) : null}

        <p className="mt-6 text-[1.05rem] leading-[1.7] text-[var(--text-secondary)]">
          {profile.body}
        </p>

        {profile.leakEstimate ? (
          <div
            className="mt-8 border-l-[3px] pl-4"
            style={{ borderColor: profile.accent }}
          >
            <p className="text-[0.72rem] font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">
              Estimated leak
            </p>
            <p className="mt-1.5 text-[0.98rem] leading-relaxed text-[var(--text)]">
              {profile.leakEstimate}
            </p>
          </div>
        ) : null}

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-10 inline-flex"
        >
          {profile.cta}
        </a>
      </div>
    </section>
  );
}
