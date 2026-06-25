'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, MailOpen, RefreshCw, Eye, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

interface ContactMessage {
  _id: string
  name: string
  email: string
  message: string
  read: boolean
  source: 'contact_form' | 'chat'
  createdAt: string
  replied?: boolean
  replyText?: string
  repliedAt?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMessage, setViewMessage] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const { toast } = useToast()

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/messages')
      const result = await res.json()
      if (result.success) {
        setMessages(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to sync contact logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkAsRead = async (msg: ContactMessage) => {
    try {
      const res = await fetch(`/api/messages/${msg._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !msg.read }),
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: 'Database Updated',
          description: msg.read ? 'Message marked as unread.' : 'Message marked as read.',
        })
        fetchMessages()
        if (viewMessage && viewMessage._id === msg._id) {
          setViewMessage({ ...viewMessage, read: !msg.read })
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleOpenMessage = (msg: ContactMessage) => {
    setViewMessage(msg)
    setReplyText('')
    if (!msg.read) {
      handleMarkAsRead(msg)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/messages/${deleteId}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Message deleted successfully.' })
        setDeleteId(null)
        setViewMessage(null)
        fetchMessages()
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to delete message', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed to process purge command.', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReply = async () => {
    if (!viewMessage || !replyText.trim()) return
    setReplySending(true)
    try {
      const res = await fetch(`/api/messages/${viewMessage._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText }),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Reply sent successfully.' })
        setReplyText('')
        
        // Update local states immediately
        const updatedMsg: ContactMessage = {
          ...viewMessage,
          read: true,
          replied: true,
          replyText: replyText,
          repliedAt: new Date().toISOString()
        }
        setViewMessage(updatedMsg)
        setMessages(prev => prev.map(m => m._id === viewMessage._id ? updatedMsg : m))
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to send reply.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' })
    } finally {
      setReplySending(false)
    }
  }

  const columns = [
    {
      header: 'Sender Node',
      accessor: (item: ContactMessage) => (
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-full ${item.read ? 'bg-slate-950 text-slate-600' : 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/20'}`}>
            {item.read ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
          </div>
          <div>
            <span className={`font-semibold block ${item.read ? 'text-slate-400' : 'text-slate-200'}`}>{item.name}</span>
            <span className="font-mono text-[9px] text-slate-500">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Payload Snippet',
      accessor: (item: ContactMessage) => (
        <span className={`block max-w-[320px] truncate font-sans text-xs ${item.read ? 'text-slate-500' : 'text-slate-300'}`}>
          {item.message}
        </span>
      ),
    },
    {
      header: 'Source Channel',
      accessor: (item: ContactMessage) => (
        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded border ${
          item.source === 'chat'
            ? 'bg-[#FF4FD8]/10 text-[#FF4FD8] border-[#FF4FD8]/25'
            : 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/25'
        }`}>
          {item.source}
        </span>
      ),
    },
    {
      header: 'Reply Status',
      accessor: (item: ContactMessage) => (
        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded border ${
          item.replied
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
        }`}>
          {item.replied ? 'Replied' : 'Pending'}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: (item: ContactMessage) => (
        <span className="font-mono text-[10px] text-slate-500">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">Contact Inbox</h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Review user transmissions and chatbot conversations
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={fetchMessages}
          className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </Button>
      </div>

      {/* Messages DataTable */}
      <DataTable
        data={messages}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Filter inbox by sender name..."
        loading={loading}
        actions={(item: ContactMessage) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenMessage(item)}
              className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAsRead(item)}
              className="border-slate-800 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 text-slate-400 hover:text-[#7C3AED]"
              title={item.read ? 'Mark Unread' : 'Mark Read'}
            >
              {item.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(item._id)}
              className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      />

      {/* Message Reader Dialog */}
      <Dialog open={viewMessage !== null} onOpenChange={(open) => !open && setViewMessage(null)}>
        {viewMessage && (
          <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-xl backdrop-blur-xl">
            <DialogHeader className="border-b border-slate-900 pb-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
                  Transmission Details
                </DialogTitle>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-[#101827] text-slate-400 border border-slate-800">
                  {viewMessage.source}
                </span>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-400">
              {/* Sender info */}
              <div className="grid grid-cols-2 gap-4 bg-[#101827]/40 p-3 rounded-lg border border-slate-900">
                <div>
                  <span className="text-[10px] text-slate-500 block">Sender Name</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{viewMessage.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Contact Route</span>
                  <span className="text-slate-200 lowercase mt-0.5 block truncate">{viewMessage.email}</span>
                </div>
              </div>

              {/* Timestamp */}
              <div>
                <span className="text-[10px] text-slate-500 block mb-2">Timestamp</span>
                <span className="text-slate-300 block">{new Date(viewMessage.createdAt).toLocaleString()}</span>
              </div>

              {/* Message payload */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block mb-2">Payload Data</span>
                <div className="bg-[#050816] border border-slate-900 rounded-lg p-4 font-sans text-sm text-slate-300 normal-case leading-relaxed whitespace-pre-wrap min-h-[120px] max-h-[240px] overflow-y-auto">
                  {viewMessage.message}
                </div>
              </div>

              {/* Reply section */}
              <div className="pt-2">
                <span className="text-[10px] text-slate-500 block mb-2">Reply Message</span>
                {viewMessage.replied && (
                  <div className="mb-3 bg-[#101827]/60 border border-emerald-500/20 rounded-lg p-3 font-sans text-xs text-slate-350 normal-case leading-relaxed">
                    <div className="flex justify-between items-center mb-1.5 pb-1 border-b border-slate-900 text-[9px] text-slate-550 uppercase font-mono">
                      <span className="text-emerald-400 font-semibold">✓ Reply Sent</span>
                      <span className="text-slate-500">{viewMessage.repliedAt ? new Date(viewMessage.repliedAt).toLocaleString() : ''}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-300">{viewMessage.replyText}</div>
                  </div>
                )}
                {viewMessage.replied && (
                  <span className="text-[9px] text-slate-500 block mb-2 uppercase font-mono">
                    Send another reply:
                  </span>
                )}
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={viewMessage.replied ? "Type another reply here..." : "Type your reply here..."}
                  rows={3}
                  className="w-full rounded-lg border border-slate-800 bg-[#050816] p-3 text-sm text-slate-200 normal-case placeholder:text-slate-600 focus:outline-none focus:border-[#00E5FF]/50 resize-none font-sans"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              {/* Delete — left side */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteId(viewMessage._id)}
                className="border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400 mr-auto"
              >
                Delete
              </Button>

              {/* Mark read toggle */}
              <Button
                onClick={() => handleMarkAsRead(viewMessage)}
                variant="outline"
                className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60 text-slate-300"
              >
                {viewMessage.read ? 'Mark Unread' : 'Mark Read'}
              </Button>

              {/* Send reply */}
              <Button
                onClick={handleReply}
                disabled={replySending || !replyText.trim()}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {replySending ? 'Sending...' : 'Send Reply'}
              </Button>

              {/* Close */}
              <Button
                onClick={() => setViewMessage(null)}
                variant="outline"
                className="border-slate-800 bg-[#101827]/40 text-slate-300"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Inbox Record"
        description="Are you sure you want to delete this message record? This action will permanently delete it from MongoDB database nodes."
        confirmText="Confirm Purge"
      />
    </div>
  )
}