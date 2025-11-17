import { useState } from 'react'

export default function KeyConnect({ baseUrl, onConnected }) {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const connect = async (e) => {
    e?.preventDefault?.()
    if (!apiKey.trim()) {
      setMessage('Please paste your Gemini API key first.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch(`${baseUrl}/llm/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey.trim() })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Failed to connect')
      }
      const data = await res.json()
      setMessage(data.message || 'Connected.')
      onConnected?.(data)
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="font-semibold text-gray-800 mb-1">Connect your Gemini API key</div>
          <p className="text-sm text-gray-600 mb-3">Paste your key to enable generation and chat. Your key is stored in-memory on the server for this session only.</p>
          <form onSubmit={connect} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="password"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              placeholder="GEMINI_API_KEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-3"
            >
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          </form>
          {message ? <div className="text-xs mt-2 text-gray-600">{message}</div> : null}
        </div>
      </div>
    </div>
  )
}
