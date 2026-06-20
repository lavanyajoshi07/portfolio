'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Critical Deletion Alert',
  description = 'Warning: This operation will permanently delete the selected database nodes. This is an irreversible instruction.',
  confirmText = 'Execute Purge',
  cancelText = 'Abort Protocol',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0A1020] border border-red-500/30 text-slate-200 rounded-3xl max-w-md backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-400 mb-2 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm font-sans leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:gap-0 mt-6 font-mono text-xs uppercase tracking-wider">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={onClose}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60 text-slate-400 hover:text-white"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-red-900 hover:bg-red-700 text-white shadow-lg shadow-red-950/50"
          >
            {loading ? 'Purging...' : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
