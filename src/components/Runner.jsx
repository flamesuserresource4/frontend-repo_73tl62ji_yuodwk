import { useEffect, useRef, useState } from 'react'

// Simple in-browser runner using an iframe that loads an index.html generated from files
export default function Runner({ files }) {
  const iframeRef = useRef(null)
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => {
    // Attempt to find a single-page html entry or synthesize one from index.html
    const htmlFile = files.find(f => f.path.toLowerCase().endsWith('index.html')) || files.find(f => f.path.endsWith('.html'))
    let html = htmlFile?.content

    if (!html) {
      // Synthesize minimal HTML that loads a script if present
      const jsEntry = files.find(f => f.path.endsWith('main.js') || f.path.endsWith('index.js'))
      html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Preview</title></head><body class=\"dark:bg-[#0b0b0f]\"><div id=\"app\"></div>${jsEntry ? `<script>${jsEntry.content}</script>` : ''}</body></html>`
    } else {
      // inline other js/css files by replacing src/href with embedded content when obvious relative links
      files.filter(f => f.path.endsWith('.js') || f.path.endsWith('.css')).forEach(f => {
        const filename = f.path.split('/').pop()
        // replace src or href occurrences with inline content via data URL
        const jsData = f.path.endsWith('.js') ? `data:text/javascript;base64,${btoa(unescape(encodeURIComponent(f.content)))}` : null
        const cssData = f.path.endsWith('.css') ? `data:text/css;base64,${btoa(unescape(encodeURIComponent(f.content)))}` : null
        if (jsData) html = html.replace(new RegExp(`src=\\"(?:./)?${filename}\\"`, 'g'), `src=\"${jsData}\"`)
        if (cssData) html = html.replace(new RegExp(`href=\\"(?:./)?${filename}\\"`, 'g'), `href=\"${cssData}\"`)
      })
    }

    setSrcDoc(html)
  }, [files])

  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200/60 dark:border-white/10 bg-gray-50/80 dark:bg-white/5">
        <div className="text-sm text-gray-600 dark:text-gray-200">Live Preview</div>
        <div className="text-xs text-gray-400">In-browser sandbox</div>
      </div>
      <iframe ref={iframeRef} title="preview" className="w-full h-96 bg-white dark:bg-[#0b0b0f]" sandbox="allow-scripts allow-forms allow-same-origin" srcDoc={srcDoc} />
    </div>
  )
}
