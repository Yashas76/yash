import { useState, useEffect } from 'react'
import { expensesApi, categoriesApi, monthlyBalanceApi } from '../api/client'

const today = () => new Date().toISOString().split('T')[0]
const EMPTY = { categoryId: '', date: today(), amount: '', comment: '' }

export default function ExpenseManager() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [filterCat, setFilterCat] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch((e) => setError(e.message))
  }, [])

  useEffect(() => { load() }, [filterCat])

  async function load() {
    try {
      setExpenses(await expensesApi.getAll(filterCat || undefined))
    } catch (e) {
      setError(e.message)
    }
  }

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      categoryId: form.categoryId,
      date: form.date,
      amount: parseFloat(form.amount),
      comment: form.comment || null,
    }
    try {
      if (editingId) {
        await expensesApi.update(editingId, payload)
      } else {
        await expensesApi.create(payload)
      }
      setForm({ ...EMPTY, categoryId: form.categoryId })
      setEditingId(null)
      await monthlyBalanceApi.recalculate()
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(exp) {
    setEditingId(exp.id)
    setForm({
      categoryId: exp.category.id,
      date: exp.date,
      amount: String(exp.amount),
      comment: exp.comment || '',
    })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
    setError('')
  }

  async function remove(id) {
    if (!confirm('Delete this expense?')) return
    setError('')
    try {
      await expensesApi.delete(id)
      await monthlyBalanceApi.recalculate()
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  const categoryName = (id) => categories.find((c) => c.id === id)?.name ?? id

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)

  return (
    <div className="manager">
      <h2>Expenses</h2>

      {error && <div className="alert error">{error}</div>}

      <form className="card form-card" onSubmit={submit}>
        <h3>{editingId ? 'Edit Expense' : 'New Expense'}</h3>
        <div className="form-grid">
          <div className="field">
            <label>Category</label>
            <select required value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              <option value="">— select —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="field">
            <label>Amount (₹)</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="field full">
            <label>Comment</label>
            <input
              value={form.comment}
              onChange={(e) => set('comment', e.target.value)}
              placeholder="Optional note"
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn primary" disabled={loading}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <div className="toolbar">
        <div className="field inline">
          <label>Filter by category:</label>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <span className="total">Total: ₹{total.toFixed(2)}</span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount (₹)</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id} className={editingId === exp.id ? 'editing' : ''}>
              <td>{exp.date}</td>
              <td>{exp.category?.name ?? categoryName(exp.category?.id)}</td>
              <td className="amount">₹{parseFloat(exp.amount).toFixed(2)}</td>
              <td className="muted">{exp.comment || '—'}</td>
              <td>
                <button className="btn small" onClick={() => startEdit(exp)}>Edit</button>
                <button className="btn small danger" onClick={() => remove(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr><td colSpan={5} className="muted center">No expenses found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
