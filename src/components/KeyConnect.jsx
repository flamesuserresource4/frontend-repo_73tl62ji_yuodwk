import { useEffect, useState } from 'react'

export default function KeyConnect({ baseUrl, onConnected }) {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key')
    if (saved) setApiKey(saved)
  }, [])

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
      localStorage.setItem('gemini_api_key', apiKey.trim())
      onConnected?.(data)
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">Connect your Gemini API key</div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Paste your key to enable generation and chat. Your key is stored in-memory on the server for this session only.</p>
          <form onSubmit={connect} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="password"
              className="flex-1 rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder:text-gray-400"
              placeholder="GEMINI_API_KEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 hover:brightness-110 disabled:opacity-60 text-white font-semibold px-5 py-3 shadow-sm"
            >
              {loading ? 'Connecting…' : 'Connect'}
            </button>
          </form>
          {message ? <div className="text-xs mt-2 text-gray-600 dark:text-gray-300">{message}</div> : null}
        </div>
      </div>
    </div>
  )
}
