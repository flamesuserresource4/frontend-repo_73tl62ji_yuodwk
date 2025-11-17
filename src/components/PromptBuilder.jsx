import { useState } from 'react'

export default function PromptBuilder({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('A simple TODO app with add/delete and local state')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onGenerate(prompt.trim())
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-4 sm:p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
        <input
          className="flex-1 rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder:text-gray-400"
          placeholder="Describe the app you want to build..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 hover:brightness-110 disabled:opacity-60 text-white font-semibold px-5 py-3 shadow-sm"
        >
          {loading ? 'Generating...' : 'Generate App'}
        </button>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Uses Gemini on the backend to create all project files. Edit code below and re-run instantly in the browser.
      </p>
    </div>
  )
}
