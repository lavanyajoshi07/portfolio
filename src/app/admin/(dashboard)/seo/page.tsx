'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, RefreshCw, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'

const seoSchema = z.object({
  metaTitle: z.string().min(2, 'Meta title must be at least 2 characters'),
  metaDescription: z.string().min(10, 'Meta description must be at least 10 characters'),
  ogImage: z.string().optional(),
  twitterImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

type SeoFormData = z.infer<typeof seoSchema>

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [keywords, setKeywords] = useState('')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      ogImage: '',
      twitterImage: '',
      canonicalUrl: '',
    },
  })

  const fetchSeo = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/seo')
      const result = await res.json()
      if (result.success && result.data) {
        const d = result.data
        reset({
          metaTitle: d.metaTitle || '',
          metaDescription: d.metaDescription || '',
          ogImage: d.ogImage || '',
          twitterImage: d.twitterImage || '',
          canonicalUrl: d.canonicalUrl || '',
        })
        if (d.keywords && Array.isArray(d.keywords)) {
          setKeywords(d.keywords.join(', '))
        }
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to retrieve SEO configuration nodes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeo()
  }, [])

  const onSubmit = async (data: SeoFormData) => {
    setSaving(true)
    
    const parsedKeywords = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const payload = {
      ...data,
      keywords: parsedKeywords,
    }

    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Updated',
          description: 'SEO parameters synchronized successfully.',
        })
        fetchSeo()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update SEO settings.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Connection failure during SEO transmission.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Syncing SEO registry...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            SEO Configuration
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Configure metadata, crawlers tags, and OG previews
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={fetchSeo}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
            <Globe className="w-4.5 h-4.5 text-[#00E5FF]" />
            <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Search Console Meta Elements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Meta Title Tag</Label>
              <Input
                {...register('metaTitle')}
                placeholder="Jane Doe | AI Engineer"
                className="bg-[#101827]/70 border-slate-800 text-white font-sans"
              />
              {errors.metaTitle && <p className="text-xs text-red-500 font-mono">{errors.metaTitle.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Keywords (Comma Separated)</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="AI, LangChain, AWS, PyTorch"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] text-slate-500 uppercase">Meta Description</Label>
            <Textarea
              {...register('metaDescription')}
              placeholder="Provide a detailed meta summary..."
              rows={4}
              className="bg-[#101827]/70 border-slate-800 text-white"
            />
            {errors.metaDescription && <p className="text-xs text-red-500 font-mono">{errors.metaDescription.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Open Graph Image URL</Label>
              <Input
                {...register('ogImage')}
                placeholder="https://mywebsite.com/og.png"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Twitter Image URL</Label>
              <Input
                {...register('twitterImage')}
                placeholder="https://mywebsite.com/twitter.png"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] text-slate-500 uppercase">Canonical URL</Label>
            <Input
              {...register('canonicalUrl')}
              placeholder="https://mywebsite.com"
              className="bg-[#101827]/70 border-slate-800 text-white font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end font-mono text-xs uppercase tracking-wider">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white py-6 px-8 shadow-lg shadow-[#00E5FF]/10"
          >
            {saving ? 'Saving...' : 'Save SEO Nodes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
