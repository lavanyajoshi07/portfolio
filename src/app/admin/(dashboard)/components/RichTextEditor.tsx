'use client'

import { useState, useRef } from 'react'
import { Bold, Italic, Link2, Code, Eye, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface RichTextEditorProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Begin compilation...',
  rows = 8,
}: RichTextEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (syntax: string, placeholderText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const selectedText = text.substring(start, end)
    const replacement = syntax.includes('%s') 
      ? syntax.replace('%s', selectedText || placeholderText)
      : syntax + (selectedText || placeholderText) + syntax

    const newValue = text.substring(0, start) + replacement + text.substring(end)
    onChange(newValue)

    // Reset cursor focus
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + replacement.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Quick helper to convert basic markdown-like syntax for preview (bold, italic, code, line breaks)
  const renderSimpleHtml = (md: string) => {
    if (!md) return '<span class="text-slate-600 font-mono text-xs">NO INPUT DETECTED</span>'
    const html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded font-mono text-xs text-[#00E5FF]">$1</code>')
      .replace(/\n/g, '<br />')
    return html
  }

  return (
    <div className="glass-card bg-[#0A1020]/40 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
      {/* Editor toolbar header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-[#101827]/40">
        {/* Formatting Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={tab === 'preview'}
            onClick={() => insertMarkdown('**%s**', 'bold text')}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={tab === 'preview'}
            onClick={() => insertMarkdown('*%s*', 'italic text')}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={tab === 'preview'}
            onClick={() => insertMarkdown('[%s](url)', 'link text')}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Link"
          >
            <Link2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={tab === 'preview'}
            onClick={() => insertMarkdown('`%s`', 'code block')}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Inline Code"
          >
            <Code className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 border border-slate-800 rounded-lg p-0.5 bg-slate-950 font-mono text-[9px] uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              tab === 'write' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Edit3 className="w-2.5 h-2.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
              tab === 'preview' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Eye className="w-2.5 h-2.5" />
            <span>Viewer</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1">
        {tab === 'write' ? (
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            rows={rows}
            className="w-full bg-transparent border-0 text-slate-300 placeholder-slate-600 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-4 resize-none font-mono text-sm leading-relaxed"
          />
        ) : (
          <div
            className="p-4 overflow-y-auto text-slate-300 text-sm leading-relaxed min-h-[160px] max-h-[400px] font-sans prose prose-invert select-none"
            dangerouslySetInnerHTML={{ __html: renderSimpleHtml(value) }}
            style={{ minHeight: `${rows * 20}px` }}
          />
        )}
      </div>
    </div>
  )
}
