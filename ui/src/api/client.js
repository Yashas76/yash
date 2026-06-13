const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

export const categoriesApi = {
  getAll: () => request('/categories'),
  create: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
}

export const expensesApi = {
  getAll: (categoryId) =>
    request('/expenses' + (categoryId ? `?categoryId=${categoryId}` : '')),
  create: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),
}

export const salaryApi = {
  getAll: () => request('/salary'),
  getSummary: () => request('/salary/summary'),
  create: (data) => request('/salary', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/salary/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/salary/${id}`, { method: 'DELETE' }),
}

export const visionApi = {
  analyze: async (file, prompt) => {
    const form = new FormData()
    form.append('image', file)
    form.append('prompt', prompt)
    const res = await fetch('/api/vision/analyze', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || res.statusText)
    return data
  },
}

export const monthlyBalanceApi = {
  getAll: () => request('/monthly-balance'),
  recalculate: () => request('/monthly-balance/recalculate', { method: 'POST' }),
  create: (data) => request('/monthly-balance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/monthly-balance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/monthly-balance/${id}`, { method: 'DELETE' }),
}
