import { useState } from 'react'

export default function ChatBot({ files, onApply }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Describe what you want to change or add. I will modify the code files for you.' }])
  const [input, setInput] = useState('Add a dark theme toggle and use Tailwind')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const msg = { role: 'user', content: input }
    setMessages(prev => [...prev, msg])
    setInput('')
    setLoading(true)
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/llm/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: msg.content,
          files: files.map(f => ({ path: f.path, content: f.content }))
        })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      onApply(data.files)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Applied updates to the project files.' }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200/60 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 font-semibold text-gray-700 dark:text-gray-200">Assistant</div>
      <div className="h-64 overflow-auto p-4 space-y-3 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white' : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-100'}`}>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200/60 dark:border-white/10 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for a feature..." className="flex-1 border border-gray-300 dark:border-white/15 rounded-md px-3 py-2 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400" />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-gradient-to-tr from-blue-600 to-violet-600 hover:brightness-110 disabled:opacity-60 text-white rounded-md">{loading ? 'Thinking...' : 'Send'}</button>
      </div>
    </div>
  )
}
