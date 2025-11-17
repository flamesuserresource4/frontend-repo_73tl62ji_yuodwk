import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    // prefer system
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="group relative inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-900/5 dark:bg-white/10 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-100 shadow-sm hover:bg-gray-900/10 dark:hover:bg-white/20 transition-colors"
    >
      <span className="inline-block h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-400 dark:to-indigo-500 shadow ring-2 ring-white/60 dark:ring-black/20" />
      <span className="hidden sm:inline">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
