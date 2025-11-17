import { useState } from 'react'

export default function PromptBuilder({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('A simple TODO app with add/delete and local state')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onGenerate(prompt.trim())
  }

  return (
    <div className="w-full bg-white/70 backdrop-blur rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
        <input
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Describe the app you want to build..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-3"
        >
          {loading ? 'Generating...' : 'Generate App'}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        Uses Gemini free API on the backend to create all project files. You can edit the code below and re-run instantly in the browser.
      </p>
    </div>
  )
}
