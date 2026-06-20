'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Edit, Trash2, HelpCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

const schema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  enabled: z.boolean().default(true),
  order: z.number().default(0),
})

interface Faq {
  _id: string
  question: string
  answer: string
  enabled: boolean
  order: number
}

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: '',
      answer: '',
      enabled: true,
      order: 0,
    },
  })

  const enabledValue = watch('enabled')

  const fetchFaqs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/faqs')
      const result = await res.json()
      if (result.success) {
        setFaqs(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to retrieve FAQs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  const handleOpenCreate = () => {
    setEditingFaq(null)
    reset({
      question: '',
      answer: '',
      enabled: true,
      order: 0,
    })
    setDialogOpen(true)
  }

  const handleOpenEdit = (faq: Faq) => {
    setEditingFaq(faq)
    reset({
      question: faq.question,
      answer: faq.answer,
      enabled: faq.enabled,
      order: faq.order || 0,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    const url = editingFaq ? `/api/faqs/${editingFaq._id}` : '/api/faqs'
    const method = editingFaq ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: editingFaq ? 'FAQ updated successfully' : 'FAQ created successfully',
        })
        setDialogOpen(false)
        fetchFaqs()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Operation failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Protocol connection failure.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setActionLoading(true)

    try {
      const res = await fetch(`/api/faqs/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'FAQ item deleted successfully.',
        })
        setDeleteId(null)
        fetchFaqs()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Deletion failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Connection failure during delete.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'FAQ Question',
      accessor: (item: Faq) => (
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#00E5FF]" />
          <span className="font-semibold text-slate-200">{item.question}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (item: Faq) => (
        <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-full ${
          item.enabled 
            ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.enabled ? 'Active' : 'Hidden'}
        </span>
      ),
    },
    {
      header: 'Sort Order',
      accessor: (item: Faq) => <span className="font-mono text-slate-400">{item.order}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            FAQ Builder
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Maintain questions for recruiters inside the contact accordion
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchFaqs}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>

      <DataTable
        data={faqs}
        columns={columns}
        searchKey="question"
        searchPlaceholder="Filter FAQs by question text..."
        loading={loading}
        actions={(item: Faq) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEdit(item)}
              className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white"
            >
              <Edit className="w-3.5 h-3.5" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-lg backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              {editingFaq ? 'Modify FAQ Node' : 'Add FAQ Node'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Question / Prompt</Label>
              <Input
                {...register('question')}
                placeholder="e.g. Are you open to remote internship positions?"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.question && <p className="text-xs text-red-500 font-mono">{errors.question.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Answer Body</Label>
              <Textarea
                {...register('answer')}
                placeholder="Provide a clear, brief response..."
                rows={4}
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.answer && <p className="text-xs text-red-500 font-mono">{errors.answer.message as string}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Sort Order</Label>
                <Input
                  type="number"
                  {...register('order', { valueAsNumber: true })}
                  className="bg-[#101827]/70 border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-3 py-2 mt-4">
                <Switch
                  checked={enabledValue}
                  onCheckedChange={(checked) => setValue('enabled', checked)}
                />
                <div>
                  <Label className="font-mono text-[10px] text-slate-300 uppercase">Enabled</Label>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">Visible on public page</p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-900 font-mono text-xs uppercase tracking-wider">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="border-slate-800 bg-transparent text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white"
              >
                {actionLoading ? 'Saving...' : editingFaq ? 'Save Changes' : 'Deploy Question'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy FAQ Item"
        description="Are you sure you want to delete this FAQ record? This will purge it permanently from MongoDB."
        confirmText="Confirm Purge"
      />
    </div>
  )
}
