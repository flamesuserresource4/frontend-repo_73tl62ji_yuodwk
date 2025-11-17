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
    <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/80 font-semibold text-gray-700">Assistant</div>
      <div className="h-64 overflow-auto p-4 space-y-3 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{m.content}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask for a feature..." className="flex-1 border border-gray-300 rounded-md px-3 py-2" />
        <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-md">{loading ? 'Thinking...' : 'Send'}</button>
      </div>
    </div>
  )
}
