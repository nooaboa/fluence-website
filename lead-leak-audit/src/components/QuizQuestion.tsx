import type { Question } from '../data/questions';
import { ProgressBar } from './ProgressBar';

type QuizQuestionProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedLabel?: string;
  onSelect: (label: string) => void;
  onBack: () => void;
  canGoBack: boolean;
};

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedLabel,
  onSelect,
  onBack,
  canGoBack,
}: QuizQuestionProps) {
  return (
    <section className="flex min-h-[100dvh] flex-col px-5 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="mb-8 flex items-center gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
              aria-label="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M11.25 4.5L6.75 9l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <div className="h-10 w-10 shrink-0" aria-hidden="true" />
          )}
          <div className="flex-1">
            <ProgressBar current={questionNumber} total={totalQuestions} />
          </div>
        </div>

        <div key={question.id} className="animate-fade-up flex flex-1 flex-col">
          <h2 className="font-display text-[1.55rem] leading-snug tracking-[-0.02em] text-[var(--text)] sm:text-[1.85rem]">
            {question.text}
          </h2>

          <div className="mt-8 flex flex-col gap-3" role="listbox" aria-label={question.text}>
            {question.options.map((option) => {
              const isSelected = selectedLabel === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`option-btn ${isSelected ? 'option-btn-selected' : ''}`}
                  onClick={() => onSelect(option.label)}
                >
                  <span className="option-dot" aria-hidden="true" />
                  <span className="text-left leading-snug">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
