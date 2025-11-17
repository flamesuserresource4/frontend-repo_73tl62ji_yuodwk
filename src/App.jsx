import { useMemo, useState, useEffect } from 'react'
import PromptBuilder from './components/PromptBuilder'
import Editor from './components/Editor'
import Runner from './components/Runner'
import ChatBot from './components/ChatBot'
import KeyConnect from './components/KeyConnect'
import ThemeToggle from './components/ThemeToggle'

export default function App() {
  const [files, setFiles] = useState([{
    path: 'index.html',
    content: `<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Preview</title><style>body{font-family:Inter,system-ui,Arial;padding:24px}</style></head><body><h1>Welcome</h1><p>Use the generator to create an app.</p></body></html>`
  }])
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // check status on load
    const check = async () => {
      try {
        const res = await fetch(`${baseUrl}/llm/status`)
        if (res.ok) {
          const data = await res.json()
          setConnected(Boolean(data.connected))
          setModel(data.model)
        }
      } catch {}
    }
    check()
  }, [baseUrl])

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
    if (!connected) {
      alert('Please connect your Gemini API key first.')
      return
    }
    setLoading(true)
    try {
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
    <div className="min-h-screen bg-white dark:bg-[#0b0b0f] transition-colors">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(40rem_40rem_at_20%_10%,black,transparent)]">
        <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-fuchsia-500/20 via-violet-400/10 to-transparent blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-10 space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Vibe Builder</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">Describe your idea. We generate the project with Gemini and run it instantly. Iterate with inline editing and chat.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right text-xs text-gray-500 dark:text-gray-400">
              <div>Model: {model || 'gemini-1.5-flash'}</div>
              <div className="truncate max-w-[18rem]">Files: {fileSummary}</div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 sm:p-6 shadow-sm">
            <KeyConnect baseUrl={baseUrl} onConnected={() => setConnected(true)} />
          </div>

          <div className={!connected ? 'opacity-60 pointer-events-none' : ''}>
            <PromptBuilder onGenerate={onGenerate} loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Editor
              files={files}
              onChange={updateFile}
              onSave={save}
            />
            <div className="space-y-6">
              <Runner files={files} />
              <div className={!connected ? 'opacity-60 pointer-events-none' : ''}>
                <ChatBot files={files} onApply={applyFiles} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
