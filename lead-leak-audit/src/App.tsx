import { useEffect, useRef, useState } from 'react';
import { EmailCapture, type EmailCaptureValues } from './components/EmailCapture';
import { QuizLanding } from './components/QuizLanding';
import { QuizQuestion } from './components/QuizQuestion';
import { ResultScreen } from './components/ResultScreen';
import { QUESTIONS, TOTAL_QUESTIONS } from './data/questions';
import type { Profile } from './data/profiles';
import { scoreQuiz, type AnswerRecord } from './lib/scoring';
import { getUtmParams, submitToWebhook } from './lib/webhook';

type Step = 'landing' | 'questions' | 'email' | 'result';

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const advanceTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  function startQuiz() {
    setStep('questions');
    setQuestionIndex(0);
  }

  function handleSelect(label: string) {
    const question = QUESTIONS[questionIndex];
    const nextAnswers = { ...answers, [question.key]: label };
    setAnswers(nextAnswers);

    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);

    advanceTimer.current = window.setTimeout(() => {
      if (questionIndex < TOTAL_QUESTIONS - 1) {
        setQuestionIndex((i) => i + 1);
      } else {
        setStep('email');
      }
    }, 220);
  }

  function handleBack() {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    if (questionIndex === 0) {
      setStep('landing');
      return;
    }
    setQuestionIndex((i) => i - 1);
  }

  async function handleEmailSubmit(values: EmailCaptureValues) {
    // Honeypot filled → silently drop webhook, still show results
    const isBot = values.website_url.trim().length > 0;
    const scored = scoreQuiz(answers);
    setFirstName(values.first_name);
    setTotalScore(scored.totalScore);
    setProfile(scored.profile);
    setIsSubmitting(true);

    if (!isBot) {
      // Fire-and-forget: never block the results reveal on webhook outcome
      void submitToWebhook({
        first_name: values.first_name,
        email: values.email,
        total_score: scored.totalScore,
        profile: scored.profile.name,
        answers,
        ...getUtmParams(),
        submitted_at: new Date().toISOString(),
      });
    }

    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 600);
    });

    setIsSubmitting(false);
    setStep('result');
    window.scrollTo(0, 0);
  }

  return (
    <div className="app-shell">
      <div className="grain" aria-hidden="true" />
      {step === 'landing' ? <QuizLanding onStart={startQuiz} /> : null}

      {step === 'questions' ? (
        <QuizQuestion
          question={QUESTIONS[questionIndex]}
          questionNumber={questionIndex + 1}
          totalQuestions={TOTAL_QUESTIONS}
          selectedLabel={answers[QUESTIONS[questionIndex].key]}
          onSelect={handleSelect}
          onBack={handleBack}
          canGoBack
        />
      ) : null}

      {step === 'email' ? (
        <EmailCapture onSubmit={handleEmailSubmit} isSubmitting={isSubmitting} />
      ) : null}

      {step === 'result' && profile ? (
        <ResultScreen
          profile={profile}
          totalScore={totalScore}
          firstName={firstName}
        />
      ) : null}
    </div>
  );
}
