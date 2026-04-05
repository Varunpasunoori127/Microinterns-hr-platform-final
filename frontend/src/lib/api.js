const base = import.meta.env.VITE_API_URL || '';

function buildUrl(path) {
  if (!path.startsWith('/')) path = '/' + path;
  return `${base}${path}`;
}

// ✅ TOKEN
function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function request(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();

  // 🔥 ATTACH TOKEN
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path), {
    ...opts,
    headers,
  });

  // 🔥 DO NOT AUTO LOGOUT (IMPORTANT FIX)
  if (res.status === 401 || res.status === 403) {
    console.error("AUTH ERROR:", res.status);
    // ❌ removed redirect
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }

  return res.json();
}

// ✅ METHODS
export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function put(path, body) {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function del(path) {
  return request(path, { method: "DELETE" });
}

export default { get, post, put, del };