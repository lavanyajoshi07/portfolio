'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Link2, FileText, Image as ImageIcon, Music, Video, RefreshCw, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MediaUploader from '../components/MediaUploader'
import ConfirmDialog from '../components/ConfirmDialog'

interface MediaAsset {
  _id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  publicId: string
  size?: number
  mimeType?: string
  dimensions?: { width: number; height: number }
  duration?: number
}

const CATEGORIES = [
  { value: 'all', label: 'All Assets' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'audio', label: 'Audio' },
  { value: 'document', label: 'Documents' },
]

export default function MediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document'>('all')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/media')
      const result = await res.json()
      if (result.success) {
        setAssets(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve media library.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast({
      title: 'Copied',
      description: 'Media URL copied to clipboard.',
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setActionLoading(true)

    try {
      const res = await fetch(`/api/media/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Deleted',
          description: 'Media asset deleted successfully.',
        })
        setDeleteId(null)
        fetchMedia()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete asset',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Network failure deleting record.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const filteredAssets = assets.filter((asset) => {
    if (filter === 'all') return true
    return asset.type === filter
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-[#00E5FF]" />
      case 'audio':
        return <Music className="w-8 h-8 text-[#FF4FD8]" />
      case 'video':
        return <Video className="w-8 h-8 text-[#7C3AED]" />
      default:
        return <FileText className="w-8 h-8 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Media Hub
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Store and index assets in Cloudinary CDN
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchMedia}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Upload Asset</span>
          </Button>
        </div>
      </div>

      {/* Categories Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-900/60 pb-4 font-mono text-xs uppercase tracking-wider">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value as any)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === cat.value
                ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30 shadow-[0_0_10px_rgba(0,229,255,0.05)]'
                : 'bg-[#101827]/20 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-[#101827]/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Loading asset indices...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-24 glass-card bg-[#0A1020]/20 border border-slate-900 rounded-2xl">
          <p className="font-mono text-slate-500 text-xs uppercase tracking-widest">No assets logged in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className="glass-card bg-[#0A1020]/40 border border-slate-900 hover:border-[#00E5FF]/20 rounded-xl overflow-hidden flex flex-col group transition-all duration-300"
            >
              {/* Media Preview Box */}
              <div className="h-40 bg-slate-950/60 flex items-center justify-center relative overflow-hidden group border-b border-slate-900">
                {asset.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(asset.type)}
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{asset.mimeType}</span>
                  </div>
                )}
                
                {/* Hover actions overlay */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyUrl(asset.url, asset._id)}
                    className="h-9 w-9 p-0 border-slate-800 bg-[#101827]/70 text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/20"
                    title="Copy URL"
                  >
                    {copiedId === asset._id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(asset.url, '_blank')}
                    className="h-9 w-9 p-0 border-slate-800 bg-[#101827]/70 text-slate-300 hover:text-white"
                    title="Open Link"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(asset._id)}
                    className="h-9 w-9 p-0 border-slate-800 bg-[#101827]/70 text-slate-300 hover:text-red-400 hover:border-red-500/20"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Media Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-mono text-xs font-semibold text-slate-200 truncate uppercase tracking-wider" title={asset.name}>
                    {asset.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>{asset.type}</span>
                    {asset.size && (
                      <span>{(asset.size / (1024 * 1024)).toFixed(2)} MB</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-lg backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Upload Media Asset
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <MediaUploader
              onUploadSuccess={() => {
                fetchMedia()
                setUploadDialogOpen(false)
              }}
              onClose={() => setUploadDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Media Asset"
        description="Proceeding will remove this file from Cloudinary storage CDN and clear it from the MongoDB local index registry."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
