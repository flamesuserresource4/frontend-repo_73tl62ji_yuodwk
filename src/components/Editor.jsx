import { useEffect, useMemo, useRef, useState } from 'react'

// Lightweight code editor using textarea with line numbers
export default function Editor({ files, onChange, onSave }) {
  const [activePath, setActivePath] = useState(files?.[0]?.path || '')
  const activeFile = useMemo(() => files.find(f => f.path === activePath) || files[0] || null, [files, activePath])
  const [value, setValue] = useState(activeFile?.content || '')
  const textRef = useRef(null)

  useEffect(() => {
    const f = files.find(f => f.path === activePath) || files[0]
    setValue(f ? f.content : '')
  }, [activePath, files])

  const handleSave = () => {
    if (!activeFile) return
    onChange(activePath, value)
    onSave?.()
  }

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur overflow-hidden shadow-sm">
      <div className="flex border-b border-gray-200/60 dark:border-white/10 bg-gray-50/80 dark:bg-white/5">
        <div className="w-56 border-r border-gray-200/60 dark:border-white/10 max-h-80 overflow-auto">
          {files.map(f => (
            <button
              key={f.path}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50/70 dark:hover:bg-white/10 ${activePath === f.path ? 'bg-white dark:bg-white/5 font-semibold text-blue-700 dark:text-cyan-300' : 'text-gray-700 dark:text-gray-200'}`}
              onClick={() => setActivePath(f.path)}
            >
              {f.path}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">Editing: {activePath}</div>
            <button onClick={handleSave} className="px-3 py-1.5 bg-gradient-to-tr from-blue-600 to-violet-600 hover:brightness-110 text-white rounded-md text-sm">Save</button>
          </div>
          <textarea
            ref={textRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-80 p-3 font-mono text-sm outline-none resize-none bg-white dark:bg-[#0b0b0f] text-gray-900 dark:text-gray-100"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
