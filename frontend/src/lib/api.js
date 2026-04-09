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

// ✅ CORE REQUEST (FIXED FOR DELETE)
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

  // 🔥 AUTH DEBUG (NO AUTO REDIRECT)
  if (res.status === 401 || res.status === 403) {
    console.error("AUTH ERROR:", res.status);
  }

  // ❌ ERROR HANDLING
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }

  // ✅ FIX: HANDLE EMPTY RESPONSE (DELETE)
  const text = await res.text();
  return text ? JSON.parse(text) : true;
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

// ✅ DELETE (FIXED)
export function del(path) {
  return request(path, { method: "DELETE" });
}

// ✅ EXPORT
export default {
  get,
  post,
  put,
  del
};