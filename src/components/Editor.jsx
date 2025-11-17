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
    <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50/80">
        <div className="w-56 border-r border-gray-200 max-h-80 overflow-auto">
          {files.map(f => (
            <button
              key={f.path}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${activePath === f.path ? 'bg-white font-semibold text-blue-700' : 'text-gray-700'}`}
              onClick={() => setActivePath(f.path)}
            >
              {f.path}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="text-xs text-gray-500">Editing: {activePath}</div>
            <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">Save</button>
          </div>
          <textarea
            ref={textRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full h-80 p-3 font-mono text-sm outline-none resize-none bg-white"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  )
}
