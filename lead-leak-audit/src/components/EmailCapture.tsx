import { useState, type FormEvent } from 'react';

export type EmailCaptureValues = {
  first_name: string;
  email: string;
  website_url: string;
};

type EmailCaptureProps = {
  onSubmit: (values: EmailCaptureValues) => void;
  isSubmitting: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailCapture({ onSubmit, isSubmitting }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ first_name?: string; email?: string }>({});

  function validate(): boolean {
    const next: { first_name?: string; email?: string } = {};
    if (!firstName.trim()) next.first_name = 'First name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate() || isSubmitting) return;
    onSubmit({
      first_name: firstName.trim(),
      email: email.trim().toLowerCase(),
      website_url: honeypot,
    });
  }

  return (
    <section className="animate-fade-up flex min-h-[100dvh] flex-col justify-center px-5 py-12 sm:px-8">
      <div className="mx-auto w-full max-w-md">
        <p className="mb-4 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[var(--brand)]">
          Almost there
        </p>
        <h2 className="font-display text-[1.85rem] leading-tight tracking-[-0.025em] text-[var(--text)] sm:text-[2.15rem]">
          Your Lead Leak Profile is ready.
        </h2>
        <p className="mt-3 text-[1.02rem] text-[var(--text-secondary)]">
          Where should I send it?
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="first_name" className="field-label">
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`field-input ${errors.first_name ? 'field-input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.first_name ? (
              <p className="mt-1.5 text-sm text-[var(--error)]">{errors.first_name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`field-input ${errors.email ? 'field-input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.email ? (
              <p className="mt-1.5 text-sm text-[var(--error)]">{errors.email}</p>
            ) : null}
          </div>

          {/* Honeypot — bots fill this; humans never see it */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
            <label htmlFor="website_url">Website</label>
            <input
              id="website_url"
              name="website_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Loading…' : 'Show My Results'}
          </button>
        </form>
      </div>
    </section>
  );
}
