import { useState, useEffect } from 'react'
import { salaryApi, monthlyBalanceApi } from '../api/client'

const today = () => new Date().toISOString().split('T')[0]
const EMPTY = { date: today(), amount: '' }

export default function SalaryManager() {
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState([])
  const [showSummary, setShowSummary] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [data, sum] = await Promise.all([salaryApi.getAll(), salaryApi.getSummary()])
      setRows(data)
      setSummary(sum)
    } catch (e) { setError(e.message) }
  }

  function set(field, value) { setForm((p) => ({ ...p, [field]: value })) }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = { date: form.date, amount: parseFloat(form.amount) }
    try {
      if (editingId) { await salaryApi.update(editingId, payload) }
      else { await salaryApi.create(payload) }
      setForm(EMPTY)
      setEditingId(null)
      await monthlyBalanceApi.recalculate()
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
    if (!confirm('Delete this salary entry?')) return
    try { await salaryApi.delete(id); await monthlyBalanceApi.recalculate(); await load() }
    catch (e) { setError(e.message) }
  }

  const totalSalary = rows.reduce((s, r) => s + parseFloat(r.amount), 0)

  return (
    <div className="manager">
      <h2>Salary</h2>
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

      {/* Monthly Remaining Summary */}
      <div className="section-header">
        <h3 className="section-title">Monthly Salary Remaining</h3>
        <button className="btn small" onClick={() => setShowSummary((v) => !v)}>
          {showSummary ? 'Hide' : 'Show'}
        </button>
      </div>

      {showSummary && (
        <table className="table" style={{ marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Salary (₹)</th>
              <th>Expenses (₹)</th>
              <th>Remaining (₹)</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s) => {
              const rem = parseFloat(s.remaining)
              return (
                <tr key={s.month}>
                  <td>{s.monthLabel}</td>
                  <td className="amount">₹{parseFloat(s.totalSalary).toFixed(2)}</td>
                  <td className="amount negative">₹{parseFloat(s.totalExpenses).toFixed(2)}</td>
                  <td className={`amount ${rem >= 0 ? 'positive' : 'negative'}`}>
                    {rem < 0 ? '-' : ''}₹{Math.abs(rem).toFixed(2)}
                  </td>
                </tr>
              )
            })}
            {summary.length === 0 && (
              <tr><td colSpan={4} className="muted center">No data — add salary &amp; expenses first</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* Salary entries */}
      <div className="toolbar">
        <span className="section-title">All Entries</span>
        <span className="total">Total: ₹{totalSalary.toFixed(2)}</span>
      </div>

      <table className="table">
        <thead>
          <tr><th>Date</th><th>Amount (₹)</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={editingId === r.id ? 'editing' : ''}>
              <td>{r.date}</td>
              <td className="amount">₹{parseFloat(r.amount).toFixed(2)}</td>
              <td>
                <button className="btn small" onClick={() => startEdit(r)}>Edit</button>
                <button className="btn small danger" onClick={() => remove(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={3} className="muted center">No entries</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
