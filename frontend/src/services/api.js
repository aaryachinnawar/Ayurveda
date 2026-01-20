const API_URL = 'http://localhost:8080/api/users';

export async function login(username, password, role) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

function getAuthHeader() {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth && auth.token) {
    return { 'Authorization': 'Bearer ' + auth.token };
  }
  return {};
}

export async function getUsers() {
  const res = await fetch(API_URL, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchRoles() {
  const res = await fetch('http://localhost:8080/api/roles', {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to fetch roles');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id, user) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to delete user');
}

export async function registerUser(user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    let errorMsg = 'Failed to register';
    try {
      const data = await res.json();
      errorMsg = typeof data === 'string' ? data : (data.error || errorMsg);
    } catch (e) {}
    throw new Error(errorMsg);
  }
  return res.json();
}

// Backend CSV filter API (to be implemented in backend)
export async function fetchFilteredCsvData(filters) {
  const res = await fetch('http://localhost:8080/api/csv/filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters)
  });
  if (!res.ok) throw new Error('Failed to fetch filtered CSV data');
  return res.json();
} 