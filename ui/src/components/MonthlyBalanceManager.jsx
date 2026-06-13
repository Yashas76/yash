import { useState, useEffect } from 'react'
import { monthlyBalanceApi } from '../api/client'

const today = () => new Date().toISOString().split('T')[0]
const EMPTY = { date: today(), amount: '' }

export default function MonthlyBalanceManager() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try { setRows(await monthlyBalanceApi.getAll()) }
    catch (e) { setError(e.message) }
  }

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })) }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = { date: form.date, amount: parseFloat(form.amount) }
    try {
      if (editingId) { await monthlyBalanceApi.update(editingId, payload) }
      else { await monthlyBalanceApi.create(payload) }
      setForm(EMPTY)
      setEditingId(null)
      await load()
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  function startEdit(row) {
    setEditingId(row.id)
    setForm({ date: row.date, amount: String(row.amount) })
    setError('')
  }

  function cancelEdit() { setEditingId(null); setForm(EMPTY); setError('') }

  async function remove(id) {
    if (!confirm('Delete this balance entry?')) return
    try { await monthlyBalanceApi.delete(id); await load() }
    catch (e) { setError(e.message) }
  }

  const total = rows.reduce((s, r) => s + parseFloat(r.amount), 0)

  return (
    <div className="manager">
      <h2>Monthly Balance</h2>
      {error && <div className="alert error">{error}</div>}

      <form className="card form-card" onSubmit={submit}>
        <h3>{editingId ? 'Edit Entry' : 'New Entry'}</h3>
        <div className="form-grid">
          <div className="field">
            <label>Date</label>
            <input type="date" required value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
          <div className="field">
            <label>Amount (₹)</label>
            <input type="number" required min="0.01" step="0.01" value={form.amount}
              onChange={(e) => set('amount', e.target.value)} placeholder="0.00" />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn primary" disabled={loading}>{editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <div className="toolbar">
        <span />
        <span className="total">Total: ₹{total.toFixed(2)}</span>
      </div>

      <table className="table">
        <thead>
          <tr><th>Month</th><th>Balance (₹)</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const bal = parseFloat(r.amount)
            return (
              <tr key={r.id} className={editingId === r.id ? 'editing' : ''}>
                <td>{new Date(r.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</td>
                <td className={`amount ${bal < 0 ? 'negative' : 'positive'}`}>
                  {bal < 0 ? '-' : ''}₹{Math.abs(bal).toFixed(2)}
                </td>
                <td>
                  <button className="btn small" onClick={() => startEdit(r)}>Edit</button>
                  <button className="btn small danger" onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && <tr><td colSpan={3} className="muted center">No entries — add salary &amp; expenses to auto-calculate</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
