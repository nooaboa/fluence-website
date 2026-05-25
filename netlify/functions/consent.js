const crypto = require('crypto');

const COOKIE_NAME = 'fluence_consent';
const POLICY_VERSION = '2026-05-01';
const MAX_AGE = 31536000; // 12 months

function getSecret() {
  const secret = process.env.CONSENT_SECRET;
  if (!secret || secret.length < 32) {
    return null;
  }
  return secret;
}

function sign(payloadB64, secret) {
  return crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

function encodeConsent(data) {
  const secret = getSecret();
  if (!secret) return null;
  const payloadB64 = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

function decodeConsent(cookieValue) {
  const secret = getSecret();
  if (!secret || !cookieValue) return null;

  const parts = cookieValue.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expected = sign(payloadB64, secret);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (typeof data.v !== 'string' || typeof data.analytics !== 'boolean' || typeof data.ts !== 'string') {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function parseCookies(header) {
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) acc[key] = rest.join('=');
    return acc;
  }, {});
}

function corsHeaders(event) {
  const origin = event.headers.origin || event.headers.Origin;
  const host = event.headers.host || event.headers.Host;
  const allowed = origin && host && new URL(origin).host === host
    ? origin
    : host
      ? `https://${host}`
      : null;

  return {
    'Access-Control-Allow-Origin': allowed || '',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

function buildSetCookie(value, isSecure) {
  const flags = [
    `${COOKIE_NAME}=${value}`,
    'Path=/',
    `Max-Age=${MAX_AGE}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isSecure) flags.push('Secure');
  return flags.join('; ');
}

function clearCookie(isSecure) {
  const flags = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'Max-Age=0',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (isSecure) flags.push('Secure');
  return flags.join('; ');
}

exports.handler = async (event) => {
  const cors = corsHeaders(event);
  const isSecure = (event.headers['x-forwarded-proto'] || 'https') === 'https';

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }

  if (!getSecret()) {
    return jsonResponse(503, { error: 'Consent service unavailable' }, cors);
  }

  const cookies = parseCookies(event.headers.cookie || event.headers.Cookie);

  if (event.httpMethod === 'GET') {
    const data = decodeConsent(cookies[COOKIE_NAME]);
    if (!data) {
      return jsonResponse(200, { consent: null }, cors);
    }
    return jsonResponse(200, {
      consent: {
        policyVersion: data.v,
        analytics: data.analytics,
        timestamp: data.ts,
      },
    }, cors);
  }

  if (event.httpMethod === 'POST') {
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return jsonResponse(400, { error: 'Invalid JSON body' }, cors);
    }

    if (typeof body.analytics !== 'boolean') {
      return jsonResponse(400, { error: 'analytics must be a boolean' }, cors);
    }

    const payload = {
      v: POLICY_VERSION,
      analytics: body.analytics,
      ts: new Date().toISOString(),
    };

    const signed = encodeConsent(payload);
    if (!signed) {
      return jsonResponse(503, { error: 'Consent service unavailable' }, cors);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': buildSetCookie(signed, isSecure),
        ...cors,
      },
      body: JSON.stringify({
        consent: {
          policyVersion: payload.v,
          analytics: payload.analytics,
          timestamp: payload.ts,
        },
      }),
    };
  }

  if (event.httpMethod === 'DELETE') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie(isSecure),
        ...cors,
      },
      body: JSON.stringify({ consent: null }),
    };
  }

  return jsonResponse(405, { error: 'Method not allowed' }, cors);
};

exports.POLICY_VERSION = POLICY_VERSION;
