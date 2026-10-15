/**
 * Safe fetch & JSON response parser for AI Studio web & deployment environments.
 * Prevents "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
 * by safely reading response streams, tolerating empty responses, and extracting
 * structured errors from any HTTP status code or non-JSON proxy payload.
 */

export interface SafeParsedResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: string;
  status: number;
  ok: boolean;
}

export async function safeParseResponse<T = any>(
  res: Response
): Promise<SafeParsedResponse<T>> {
  const status = res.status;
  const ok = res.ok;
  let text = '';

  try {
    text = await res.text();
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: `Network error reading response: ${err.message}`,
      status,
      ok: false,
    };
  }

  // Handle empty bodies (0 bytes, 204 No Content, empty 200)
  if (!text || !text.trim()) {
    if (!ok) {
      return {
        success: false,
        data: null,
        error: `Server returned HTTP ${status} with empty response.`,
        status,
        ok,
      };
    }
    return {
      success: true,
      data: { success: true } as unknown as T,
      status,
      ok,
    };
  }

  // Attempt standard JSON parsing
  try {
    const json = JSON.parse(text);
    const isSuccess = ok && (json.success !== false);
    return {
      success: isSuccess,
      data: json,
      error: json.error || (!ok ? `HTTP ${status}: ${json.message || 'Request failed'}` : undefined),
      status,
      ok,
    };
  } catch {
    // Non-JSON response (e.g., HTML 502/504 Bad Gateway, Cloudflare interstitial, or raw text)
    const preview = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
    return {
      success: false,
      data: null,
      error: preview ? `Server (${status}): ${preview}` : `Server returned non-JSON response (${status}).`,
      status,
      ok,
    };
  }
}

/**
 * Universal safe fetch wrapper that executes fetch and immediately parses the response
 * safely without ever throwing "Unexpected end of JSON input" or "Failed to execute 'json'".
 */
export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeParsedResponse<T>> {
  try {
    const res = await fetch(input, init);
    return await safeParseResponse<T>(res);
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err?.message || 'Network request failed or endpoint unreachable',
      status: 0,
      ok: false,
    };
  }
}

