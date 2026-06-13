import { useState, useRef } from 'react'
import { visionApi } from '../api/client'

const DEFAULT_PROMPT = 'Describe this image in detail.'

export default function VisionAnalyzer() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult('')
    setError('')
  }

  function onFileChange(e) {
    handleFile(e.target.files[0])
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function onDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave() {
    setDragging(false)
  }

  function clearImage() {
    setImage(null)
    setPreview(null)
    setResult('')
    setError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function analyze() {
    if (!image) return
    setLoading(true)
    setError('')
    setResult('')
    try {
      const data = await visionApi.analyze(image, prompt)
      setResult(data.result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manager">
      <h2>Image Analysis <span className="ai-badge">AI · LLaVA</span></h2>

      {error && <div className="alert error">{error}</div>}

      <div className="vision-layout">
        {/* Left: upload + prompt */}
        <div className="vision-left">
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${preview ? 'has-image' : ''}`}
            onClick={() => !preview && fileRef.current.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="image-preview" />
                <button className="btn small danger clear-btn" onClick={(e) => { e.stopPropagation(); clearImage() }}>
                  Remove
                </button>
              </>
            ) : (
              <div className="drop-hint">
                <span className="drop-icon">🖼️</span>
                <p>Click or drag &amp; drop an image here</p>
                <p className="muted small">PNG, JPG, WEBP — max 20MB</p>
              </div>
            )}
          </div>

          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />

          <div className="card form-card" style={{ marginTop: '1rem' }}>
            <div className="field">
              <label>Prompt</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask the AI anything about the image…"
              />
            </div>
            <div className="form-actions">
              <button className="btn primary" disabled={!image || loading} onClick={analyze}>
                {loading ? 'Analyzing…' : 'Analyze Image'}
              </button>
              {loading && <span className="muted small" style={{ alignSelf: 'center' }}>This may take a moment…</span>}
            </div>
          </div>
        </div>

        {/* Right: result */}
        <div className="vision-right">
          <div className="card result-card">
            <h3>Result</h3>
            {result
              ? <p className="result-text">{result}</p>
              : <p className="muted">Upload an image and click <strong>Analyze Image</strong> to see the AI response.</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
