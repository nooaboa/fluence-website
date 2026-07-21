import type { AnswerRecord } from './scoring';

export type WebhookPayload = {
  first_name: string;
  email: string;
  total_score: number;
  profile: string;
  answers: AnswerRecord;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  submitted_at: string;
};

const TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postOnce(url: string, payload: WebhookPayload): Promise<void> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function submitToWebhook(payload: WebhookPayload): Promise<void> {
  const url = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

  if (!url) {
    console.error('[Lead Leak Audit] VITE_N8N_WEBHOOK_URL is not set');
    return;
  }

  try {
    await postOnce(url, payload);
  } catch (firstError) {
    console.error('[Lead Leak Audit] Webhook failed, retrying once…', firstError);
    try {
      await sleep(RETRY_DELAY_MS);
      await postOnce(url, payload);
    } catch (secondError) {
      console.error('[Lead Leak Audit] Webhook failed after retry', secondError);
    }
  }
}

export function getUtmParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  };
}
