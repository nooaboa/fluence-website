import { PROFILES, type Profile } from '../data/profiles';
import { QUESTIONS } from '../data/questions';

export type AnswerRecord = Record<string, string>;

export function getAnswerScore(questionKey: string, answerLabel: string): number {
  const question = QUESTIONS.find((q) => q.key === questionKey);
  if (!question) return 0;
  const option = question.options.find((o) => o.label === answerLabel);
  return option?.score ?? 0;
}

export function calculateTotalScore(answers: AnswerRecord): number {
  return QUESTIONS.reduce((sum, question) => {
    const label = answers[question.key];
    if (!label) return sum;
    return sum + getAnswerScore(question.key, label);
  }, 0);
}

export function getProfileForScore(totalScore: number): Profile {
  const match = PROFILES.find(
    (profile) => totalScore >= profile.minScore && totalScore <= profile.maxScore,
  );
  return match ?? PROFILES[0];
}

export function scoreQuiz(answers: AnswerRecord): {
  totalScore: number;
  profile: Profile;
} {
  const totalScore = calculateTotalScore(answers);
  return {
    totalScore,
    profile: getProfileForScore(totalScore),
  };
}
