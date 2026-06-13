'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RefreshCw, Save, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Site name must be at least 2 characters'),
  siteDescription: z.string().min(10, 'Site description must be at least 10 characters'),
  googleAnalyticsId: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').or(z.literal('')),
  copyrightText: z.string().optional(),
  maintenanceMode: z.boolean().default(false),
  allowChatbot: z.boolean().default(true),
  accentColor: z.string().min(4, 'Color code required').default('#00E5FF'),
  secondaryColor: z.string().min(4, 'Color code required').default('#FF4FD8'),
  splashEnabled: z.boolean().default(true),
videoAvatarEnabled: z.boolean().default(true),
animatedBgEnabled: z.boolean().default(true),
audioPlayerEnabled: z.boolean().default(true),

})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [keywords, setKeywords] = useState('')
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      googleAnalyticsId: '',
      contactEmail: '',
      copyrightText: '',
      maintenanceMode: false,
      allowChatbot: true,
      accentColor: '#00E5FF',
      secondaryColor: '#FF4FD8',
      splashEnabled: true,
videoAvatarEnabled: true,
animatedBgEnabled: true,
audioPlayerEnabled: true,

    },
  })

  const maintenanceModeValue = watch('maintenanceMode')
  const allowChatbotValue = watch('allowChatbot')

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings')
      const result = await res.json()
      if (result.success && result.data) {
        const d = result.data
        reset({
          siteName: d.siteName || '',
          siteDescription: d.siteDescription || '',
          googleAnalyticsId: d.googleAnalyticsId || '',
          contactEmail: d.contactEmail || '',
          copyrightText: d.copyrightText || '',
          maintenanceMode: d.maintenanceMode || false,
          allowChatbot: d.allowChatbot || false,
          accentColor: d.accentColor || '#00E5FF',
          secondaryColor: d.secondaryColor || '#FF4FD8',
          splashEnabled: d.splashEnabled ?? true,
videoAvatarEnabled: d.videoAvatarEnabled ?? true,
animatedBgEnabled: d.animatedBgEnabled ?? true,
audioPlayerEnabled: d.audioPlayerEnabled ?? true,

        })
        if (d.siteKeywords && Array.isArray(d.siteKeywords)) {
          setKeywords(d.siteKeywords.join(', '))
        }
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to synchronize configuration nodes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true)
    
    // Parse keywords from comma-separated string
    const parsedKeywords = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0)

    const payload = {
      ...data,
      siteKeywords: parsedKeywords,
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Updated',
          description: 'Global system parameters synchronized.',
        })
        fetchSettings()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update system settings.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Transmission Error',
        description: 'Connection failure during sync.',
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
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Syncing settings interface...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            System Settings
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Configure global variables, SEO metadata, and feature toggles
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={fetchSettings}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile / SEO Card */}
        <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
            <Settings2 className="w-4.5 h-4.5 text-[#00E5FF]" />
            <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Site Identity & Metadata (SEO)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Site Header Name</Label>
              <Input
                {...register('siteName')}
                placeholder="e.g. AI Engineer Workspace"
                className="bg-[#101827]/70 border-slate-800 text-white font-sans"
              />
              {errors.siteName && <p className="text-xs text-red-500 font-mono">{errors.siteName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Keywords (Comma Separated)</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Next.js, Python, Anthropic, NLP"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-[10px] text-slate-500 uppercase">Site Description Meta Tag</Label>
            <Textarea
              {...register('siteDescription')}
              placeholder="Provide a description of the site for search engines..."
              rows={3}
              className="bg-[#101827]/70 border-slate-800 text-white font-sans"
            />
            {errors.siteDescription && <p className="text-xs text-red-500 font-mono">{errors.siteDescription.message}</p>}
          </div>
        </div>

        {/* System & Global Vars Card */}
        <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
            <Settings2 className="w-4.5 h-4.5 text-[#FF4FD8]" />
            <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
              Global Options & Analytics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Contact Form Routing Email</Label>
              <Input
                {...register('contactEmail')}
                placeholder="your.email@domain.com"
                className="bg-[#101827]/70 border-slate-800 text-white font-sans"
              />
              {errors.contactEmail && <p className="text-xs text-red-500 font-mono">{errors.contactEmail.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Google Analytics Tracking ID</Label>
              <Input
                {...register('googleAnalyticsId')}
                placeholder="UA-XXXXXXXXX-X"
                className="bg-[#101827]/70 border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5 col-span-2">
            <Label className="font-mono text-[10px] text-slate-500 uppercase">Footer Copyright Text</Label>
            <Input
              {...register('copyrightText')}
              placeholder="e.g. © 2026 AI Engineer Workspace. All rights reserved."
              className="bg-[#101827]/70 border-slate-800 text-white font-sans"
            />
          </div>
        </div>

        {/* Feature Flags Card */}
        {/* Feature Flags Card */}
<div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-6">
  <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
    <Settings2 className="w-4.5 h-4.5 text-[#7C3AED]" />
    <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
      Feature Control Flags
    </h2>
  </div>

  <div className="space-y-4">
    {/* Chatbot toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Interactive AI Chatbot</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">
          Allow users to interact with Claude chatbot in public interface
        </p>
      </div>
      <Switch
        checked={allowChatbotValue}
        onCheckedChange={(checked) => setValue('allowChatbot', checked)}
      />
    </div>

    {/* Maintenance toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Maintenance Mode</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">
          Restrict public portfolio access and show temporary landing page
        </p>
      </div>
      <Switch
        checked={maintenanceModeValue}
        onCheckedChange={(checked) => setValue('maintenanceMode', checked)}
      />
    </div>

    {/* Splash Screen toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Splash Screen</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">Show intro splash once per session</p>
      </div>
      <Switch
        checked={watch('splashEnabled')}
        onCheckedChange={(checked) => setValue('splashEnabled', checked)}
      />
    </div>

    {/* Video Avatar toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Video Avatar</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">Enable animated video avatar</p>
      </div>
      <Switch
        checked={watch('videoAvatarEnabled')}
        onCheckedChange={(checked) => setValue('videoAvatarEnabled', checked)}
      />
    </div>

    {/* Animated Background toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Animated Background</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">Toggle particle background effect</p>
      </div>
      <Switch
        checked={watch('animatedBgEnabled')}
        onCheckedChange={(checked) => setValue('animatedBgEnabled', checked)}
      />
    </div>

    {/* Audio Player toggle */}
    <div className="flex items-center justify-between p-4 bg-[#101827]/30 rounded-lg border border-slate-900">
      <div className="space-y-0.5">
        <Label className="font-mono text-xs text-slate-200 uppercase">Audio Player</Label>
        <p className="text-[10px] font-mono text-slate-500 uppercase">Enable intro audio player</p>
      </div>
      <Switch
        checked={watch('audioPlayerEnabled')}
        onCheckedChange={(checked) => setValue('audioPlayerEnabled', checked)}
      />
    </div>
  </div>
</div>


        {/* Submit Controls */}
        <div className="flex justify-end font-mono text-xs uppercase tracking-wider">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white py-6 px-8 shadow-lg shadow-[#00E5FF]/10"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span>Saving Nodes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span>Save Settings</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
