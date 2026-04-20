const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAccessToken() {
  return localStorage.getItem("bookcross_access") || "";
}

export function getRefreshToken() {
  return localStorage.getItem("bookcross_refresh") || "";
}

export function setTokens(access, refresh) {
  if (access) localStorage.setItem("bookcross_access", access);
  if (refresh) localStorage.setItem("bookcross_refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("bookcross_access");
  localStorage.removeItem("bookcross_refresh");
}

async function doRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail = data?.detail || JSON.stringify(data) || "Request failed";
    throw new Error(detail);
  }
  return data;
}

export const api = {
  register: (payload) => doRequest("/auth/register/", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => doRequest("/auth/login/", { method: "POST", body: JSON.stringify(payload) }),
  me: () => doRequest("/auth/me/"),
  updateMe: (payload) => doRequest("/auth/me/", { method: "PATCH", body: JSON.stringify(payload) }),
  books: (params = "") => doRequest(`/books/${params}`),
  book: (id) => doRequest(`/books/${id}/`),
  createBook: (formData) => doRequest("/books/", { method: "POST", body: formData }),
  updateBook: (id, formData) => doRequest(`/books/${id}/`, { method: "PATCH", body: formData }),
  deleteBook: (id) => doRequest(`/books/${id}/`, { method: "DELETE" }),
  myBooks: () => doRequest("/books/my/"),
  mapBooks: () => doRequest("/books/map/"),
  exchanges: () => doRequest("/exchanges/"),
  createExchange: (payload) => doRequest("/exchanges/", { method: "POST", body: JSON.stringify(payload) }),
  updateExchange: (id, payload) => doRequest(`/exchanges/${id}/`, { method: "PATCH", body: JSON.stringify(payload) }),
  cancelExchange: (id) => doRequest(`/exchanges/${id}/cancel/`, { method: "POST" }),
  reviews: (mode = "") => doRequest(`/reviews/${mode ? `?mode=${mode}` : ""}`),
  createReview: (payload) => doRequest("/reviews/", { method: "POST", body: JSON.stringify(payload) }),
  userReviews: (userId) => doRequest(`/reviews/user/${userId}/`),
};
