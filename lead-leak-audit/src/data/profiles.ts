export type ProfileId = 'cooked' | 'semi_closer' | 'locked_in' | 'leak_proof';

export type Profile = {
  id: ProfileId;
  name: string;
  headline: string;
  body: string;
  leakEstimate: string | null;
  cta: string;
  accent: string;
  accentSoft: string;
  badgeLabel: string;
  minScore: number;
  maxScore: number;
};

export const BOOKING_URL =
  import.meta.env.VITE_BOOKING_URL ??
  'https://cal.com/nooa-adams-fzrvip/strategy';

export const PROFILES: Profile[] = [
  {
    id: 'cooked',
    name: 'Cooked',
    headline: "You're Cooked",
    body: "Right now, your leads are on autopilot — just not the good kind. You've got leads coming from multiple channels and no central place to track them. If I asked you right now who still needs a follow-up, you'd have to go dig for the answer — which means somewhere, right now, a lead is going cold and you don't even know it's happening. This isn't a hustle problem. It's a visibility problem. You can't follow up on what you can't see.",
    leakEstimate:
      'Significant — likely several thousand dollars in bookable calls, quietly slipping between channels.',
    cta: "Book a call and I'll show you exactly where it's leaking.",
    accent: '#C43C2C',
    accentSoft: 'rgba(196, 60, 44, 0.12)',
    badgeLabel: 'Lead Leak Profile',
    minScore: 0,
    maxScore: 7,
  },
  {
    id: 'semi_closer',
    name: 'Semi-Closer',
    headline: "You're a Semi-Closer",
    body: "You're good at the call. You're losing everything around it. Your first response and booking process are solid — leads are getting through and getting on calls. But the moment someone doesn't show up, or doesn't buy on the first call, they disappear. No automatic rebook, no nurture sequence catching them on the way out. You're not losing leads at the front door. You're losing them on the way out the back.",
    leakEstimate:
      'Moderate — mainly recoverable revenue from no-shows and non-closes that never get a second touch.',
    cta: "Book a call and I'll show you what that adds up to.",
    accent: '#C98A1A',
    accentSoft: 'rgba(201, 138, 26, 0.14)',
    badgeLabel: 'Lead Leak Profile',
    minScore: 8,
    maxScore: 13,
  },
  {
    id: 'locked_in',
    name: 'Locked In',
    headline: "You're Locked In (but don't have to be)",
    body: "Every part of your follow-up is working — response, booking, no-shows, nurture — but it's all running through you manually. Right now that's holding, because you're disciplined. But it's fragile. One bad week, one busy stretch, one no-show you forget to chase, and leads start slipping the same way they do for everyone else. You're not leaking yet. You're one step from it.",
    leakEstimate:
      "Low today, rising with volume — the risk isn't current loss, it's what happens the moment your inbound grows past what you can personally track.",
    cta: "Book a call and let's talk about what to automate first.",
    accent: '#C2622C',
    accentSoft: 'rgba(194, 98, 44, 0.14)',
    badgeLabel: 'Lead Leak Profile',
    minScore: 14,
    maxScore: 18,
  },
  {
    id: 'leak_proof',
    name: 'Leak-Proof',
    headline: "You're Leak-Proof",
    body: "You're already doing what most coaches pay me to build. Response, booking, no-shows, and nurture are all tight. Most leads aren't slipping through — the system, manual or automated, is holding.",
    leakEstimate: null,
    cta: 'Book a call if you want a second set of eyes on where the next 10-15k comes from.',
    accent: '#2D5A27',
    accentSoft: 'rgba(45, 90, 39, 0.12)',
    badgeLabel: 'Lead Leak Profile',
    minScore: 19,
    maxScore: 21,
  },
];
