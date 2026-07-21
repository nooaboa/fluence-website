export type AnswerOption = {
  label: string;
  score: number;
};

export type Question = {
  id: string;
  key: string;
  text: string;
  options: AnswerOption[];
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    key: 'response_speed',
    text: 'When a lead messages you (DM, form, or ad), how long does it usually take before they hear back?',
    options: [
      { label: 'Under 5 min', score: 3 },
      { label: 'Within a few hours', score: 2 },
      { label: 'Next day or later', score: 1 },
      { label: 'Honestly, it varies a lot', score: 0 },
    ],
  },
  {
    id: 'q2',
    key: 'response_ownership',
    text: "Who's actually sending that first reply?",
    options: [
      { label: 'Automated system', score: 3 },
      { label: 'Me, personally', score: 2 },
      { label: 'A VA or assistant', score: 1 },
      { label: "Nobody consistently — whoever sees it first", score: 0 },
    ],
  },
  {
    id: 'q3',
    key: 'channel_spread',
    text: 'How many places do leads currently come in from?',
    options: [
      { label: 'Just one', score: 3 },
      { label: 'Two', score: 2 },
      { label: 'Three or more', score: 1 },
      { label: "I've honestly lost count", score: 0 },
    ],
  },
  {
    id: 'q4',
    key: 'centralized_tracking',
    text: 'If I asked you right now who you still owe a follow-up to, could you answer in under 30 seconds?',
    options: [
      { label: 'Yes, instantly', score: 3 },
      { label: "Yes, but I'd have to check a few places", score: 2 },
      { label: "No, I'd have to think hard", score: 1 },
      { label: "No, I genuinely don't know", score: 0 },
    ],
  },
  {
    id: 'q5',
    key: 'booking_friction',
    text: 'When someone wants to book a call, what happens?',
    options: [
      { label: 'They self-book instantly', score: 3 },
      { label: 'Some back-and-forth on timing', score: 2 },
      { label: 'I manually send times', score: 1 },
      { label: "It depends who's asking", score: 0 },
    ],
  },
  {
    id: 'q6',
    key: 'no_show_recovery',
    text: "When someone no-shows a call, what's your process?",
    options: [
      { label: 'Automatic rebook sequence fires', score: 3 },
      { label: 'I try to remember to follow up', score: 2 },
      { label: "Sometimes it just doesn't happen", score: 1 },
      { label: 'What no-show process', score: 0 },
    ],
  },
  {
    id: 'q7',
    key: 'post_call_nurture',
    text: "If someone doesn't buy on the first call, what happens next?",
    options: [
      { label: "They're in an automated nurture sequence", score: 3 },
      { label: 'I follow up manually sometimes', score: 2 },
      { label: 'They go quiet unless they reach back out', score: 1 },
      { label: 'No consistent process', score: 0 },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
