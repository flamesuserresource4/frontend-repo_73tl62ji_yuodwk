import { useEffect, useMemo, useState } from 'react'
import PromptBuilder from './components/PromptBuilder'
import Editor from './components/Editor'
import Runner from './components/Runner'
import ChatBot from './components/ChatBot'

export default function App() {
  const [files, setFiles] = useState([{
    path: 'index.html',
    content: `<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Preview</title><style>body{font-family:Inter,system-ui,Arial;padding:24px}</style></head><body><h1>Welcome</h1><p>Use the generator to create an app.</p></body></html>`
  }])
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(null)

  const updateFile = (path, content) => {
    setFiles(prev => prev.map(f => f.path === path ? { ...f, content } : f))
  }

  const applyFiles = (patch) => {
    setFiles(prev => {
      const map = new Map(prev.map(f => [f.path, f]))
      patch.forEach(p => { map.set(p.path, { path: p.path, content: p.content }) })
      return Array.from(map.values())
    })
  }

  const onGenerate = async (prompt) => {
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/llm/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setFiles(data.files)
      setModel(data.model)
    } catch (e) {
      alert(`Generation failed: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const save = () => {
    // In this ephemeral environment, Save just updates state; could be extended to zip/download
  }

  const fileSummary = useMemo(() => files.map(f => f.path).join(', '), [files])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Natural Language → Full‑stack App</h1>
            <p className="text-gray-600">Describe your idea. We generate the project using Gemini and run it in the browser. Edit code and iterate via chat.</p>
          </div>
          <div className="text-right text-xs text-gray-500">Model: {model || 'gemini-1.5-flash'}<br/>Files: {fileSummary}</div>
        </header>

        <PromptBuilder onGenerate={onGenerate} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Editor
            files={files}
            onChange={updateFile}
            onSave={save}
          />
          <div className="space-y-6">
            <Runner files={files} />
            <ChatBot files={files} onApply={applyFiles} />
          </div>
        </div>
      </div>
    </div>
  )
}
