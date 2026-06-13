import { useState, useEffect } from 'react'
import { categoriesApi } from '../api/client'

const EMPTY = { name: '' }

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setCategories(await categoriesApi.getAll())
    } catch (e) {
      setError(e.message)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editingId) {
        await categoriesApi.update(editingId, form)
      } else {
        await categoriesApi.create(form)
      }
      setForm(EMPTY)
      setEditingId(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setForm({ name: cat.name })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY)
    setError('')
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return
    setError('')
    try {
      await categoriesApi.delete(id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="manager">
      <h2>Categories</h2>

      {error && <div className="alert error">{error}</div>}

      <form className="card form-card" onSubmit={submit}>
        <h3>{editingId ? 'Edit Category' : 'New Category'}</h3>
        <div className="field">
          <label>Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            placeholder="e.g. Grocery"
          />
        </div>
        <div className="form-actions">
          <button className="btn primary" disabled={loading}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" className="btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className={editingId === cat.id ? 'editing' : ''}>
              <td>{cat.name}</td>
              <td>
                <button className="btn small" onClick={() => startEdit(cat)}>Edit</button>
                <button className="btn small danger" onClick={() => remove(cat.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr><td colSpan={2} className="muted center">No categories found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
