import { headers } from 'next/headers';

// Control characters except tab and newline.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Multi-line text (message bodies): strip control characters, trim, cap the length. */
export function cleanText(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max);
}

/** Single-line text that ends up in mail headers or subjects: no line breaks, quotes or angle brackets. */
export function cleanLine(value: FormDataEntryValue | null, max: number): string {
  return cleanText(value, max * 2)
    .replace(/[\r\n\t"<>]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

const EMAIL_RE = /^[^\s@<>",;:]+@[^\s@<>",;:]+\.[^\s@<>",;:]{2,}$/;

export function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

/** Best-effort client IP behind nginx/Passenger. Only used as a rate-limit key. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || h.get('x-real-ip') || 'unknown';
}

const hits = new Map<string, number[]>();

/**
 * Simple in-memory limiter: at most `limit` submissions per `windowMs` for one key.
 * State is per server process, which is enough to stop a script from flooding the inbox.
 */
export function rateLimited(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return false;
}

/** Name of the hidden field humans never fill in; bots usually do. */
export const HONEYPOT_FIELD = 'website';
