//
// Simple API client for the Notes frontend.
// Reads base URL from REACT_APP_API_BASE and attaches Authorization header if a JWT is present.
//

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Return the API base URL from env (REACT_APP_API_BASE). */
  const base = process.env.REACT_APP_API_BASE;
  if (!base) {
    // Fail fast in development to avoid silent misconfigurations
    // eslint-disable-next-line no-console
    console.warn("REACT_APP_API_BASE is not set. Falling back to http://localhost:3001");
  }
  return base || "http://localhost:3001";
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  /**
   * Perform a fetch call to the backend.
   * - path: string path starting with "/"
   * - method: HTTP method
   * - body: object or string; object will be JSON-stringified and content-type set
   * - headers: extra headers to include
   * - auth: when true, adds Authorization: Bearer <token> if token exists in localStorage
   */
  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const finalHeaders = { ...headers };
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
    // eslint-disable-next-line no-param-reassign
    body = JSON.stringify(body);
  }

  if (auth) {
    const token = window.localStorage.getItem("access_token");
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body,
    credentials: "include",
  });

  // Try to parse JSON; if it fails, throw a generic error
  let data;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message = (data && data.detail) || (typeof data === "string" ? data : "Request failed");
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// PUBLIC_INTERFACE
export function setAccessToken(token) {
  /** Persist JWT to localStorage for subsequent authorized requests. */
  if (token) {
    window.localStorage.setItem("access_token", token);
  } else {
    window.localStorage.removeItem("access_token");
  }
}
