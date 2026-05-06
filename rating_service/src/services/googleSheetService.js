const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

function assertScriptUrl() {
  if (!SCRIPT_URL) {
    throw new Error('Missing VITE_GOOGLE_SCRIPT_URL. Add it to .env or Vercel environment variables.');
  }
}

async function parseJsonResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from Apps Script: ${text.slice(0, 120)}`);
  }
}

export async function saveRating(payload) {
  assertScriptUrl();

  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      // text/plain avoids a CORS preflight that Apps Script web apps often mishandle.
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to save rating.');
  }

  return data;
}

export async function fetchRatings() {
  assertScriptUrl();

  const url = new URL(SCRIPT_URL);
  url.searchParams.set('action', 'list');

  const response = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow',
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load rating data.');
  }

  return data.records || [];
}
