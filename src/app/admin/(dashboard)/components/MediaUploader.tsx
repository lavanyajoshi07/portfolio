'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Music, Video, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface MediaUploaderProps {
  onUploadSuccess: (asset: any) => void
  onClose?: () => void
  allowedTypes?: string[] // e.g. ['image/*', 'application/pdf', 'audio/*']
}

export default function MediaUploader({
  onUploadSuccess,
  onClose,
  allowedTypes = ['*'],
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setStatus('idle')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus('idle')
    }
  }

  const clearFile = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
  }

  const uploadFile = async () => {
    if (!file) return
    setUploading(true)
    setStatus('idle')
    setProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // Mock progress animation since standard fetch doesn't support progress events easily
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(interval)
            return 80
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      clearInterval(interval)

      const result = await response.json()

      if (result.success) {
        setProgress(100)
        setStatus('success')
        onUploadSuccess(result.data)
        setTimeout(() => {
          clearFile()
          if (onClose) onClose()
        }, 1500)
      } else {
        setStatus('error')
        setErrorMsg(result.error || 'Failed to upload media')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg('An unexpected error occurred during file upload')
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-[#00E5FF]" />
    if (mimeType.startsWith('audio/')) return <Music className="w-8 h-8 text-[#FF4FD8]" />
    if (mimeType.startsWith('video/')) return <Video className="w-8 h-8 text-[#7C3AED]" />
    return <FileText className="w-8 h-8 text-slate-400" />
  }

  return (
    <div className="space-y-6">
      {/* Upload Box Zone */}
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[200px] ${
            dragActive 
              ? 'border-[#00E5FF] bg-[#00E5FF]/5 shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
              : 'border-slate-800 bg-[#0A1020]/40 hover:border-slate-700'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
          />
          <div className="w-12 h-12 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
            <Upload className="w-5 h-5" />
          </div>
          <p className="font-mono text-xs text-slate-300 uppercase tracking-wider mb-1">
            Drag & Drop asset or click to browse
          </p>
          <p className="font-sans text-[10px] text-slate-500">
            Supports Images, Audio (intro speech), and PDFs (Resume)
          </p>
        </div>
      ) : (
        /* File Selected / Uploading Zone */
        <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/20 rounded-xl p-6 relative">
          {!uploading && status === 'idle' && (
            <button
              onClick={clearFile}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 shrink-0">
              {getFileIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs font-semibold text-slate-200 truncate uppercase tracking-wider">
                {file.name}
              </p>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
                Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          {status === 'idle' && (
            <div className="mt-6 flex justify-end gap-3 font-mono text-xs uppercase tracking-wider">
              <Button
                variant="outline"
                onClick={clearFile}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={uploadFile}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                Upload File
              </Button>
            </div>
          )}

          {uploading && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                <span>Streaming binary packets...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1 bg-slate-900" />
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6 flex items-center gap-2 text-green-400 font-mono text-xs uppercase tracking-wider bg-green-950/20 border border-green-500/20 p-3 rounded-lg">
              <CheckCircle2 className="w-4.5 h-4.5 text-green-400 shrink-0 animate-bounce" />
              <span>Asset Upload successfully complete</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-wider bg-red-950/20 border border-red-500/20 p-3 rounded-lg">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                <span>Upload Failed: {errorMsg}</span>
              </div>
              <div className="flex justify-end gap-2 font-mono text-xs uppercase">
                <Button
                  onClick={clearFile}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  Retry Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
