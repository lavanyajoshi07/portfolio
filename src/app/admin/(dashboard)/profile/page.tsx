'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/lib/validation'
import { Save, Plus, Trash2, GraduationCap, Link2, Briefcase, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import RichTextEditor from '../components/RichTextEditor'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      title: '',
      tagline: '',
      email: '',
      location: '',
      profileImage: '',
      heroVideo: '',
      resumeUrl: '',
      yearsOfExperience: 0,
      isAvailableForWork: true,
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        website: '',
        phone: '',
        leetcode: '',
        devto: '',
        medium: '',
      },
    },
  })

  const isAvailableValue = watch('isAvailableForWork')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile')
        const result = await res.json()
        if (result.success && result.data) {
          reset(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast({
          title: 'Encryption Error',
          description: 'Failed to sync developer profile node.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [reset, toast])

  // Runs when Zod validation FAILS — without this, a failed validation just
  // silently does nothing (no request, no error), which looks like "not saving".
  const onInvalid = (formErrors: any) => {
    console.log('[v0] Profile validation failed:', formErrors)
    toast({
      title: 'Validation Error',
      description: 'Some fields are invalid. Check highlighted inputs and any URL fields.',
      variant: 'destructive',
    })
  }

  const onSubmit = async (data: any) => {
    console.log('[v0] Submitting profile payload:', data)
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Profile node updated and saved to MongoDB.',
        })
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update profile.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to submit profile update packet.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 font-mono text-xs uppercase tracking-wider">
        <span className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin mb-4" />
        <span>Syncing Profile node...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8 pb-12">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Operator Settings
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Configure developer identity parameters
          </p>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10 hover:from-[#00E5FF] hover:to-[#FF4FD8] transition-all"
        >
          <Save className="w-4 h-4 mr-2" />
          <span>{saving ? 'Saving...' : 'Deploy Changes'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Main identity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity panel */}
          <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-2">
              <User className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Core Parameters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-mono text-xs text-slate-400 uppercase">Name</Label>
                <Input
                  {...register('name')}
                  placeholder="Your name"
                  className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
                />
                {errors.name && <p className="text-xs text-red-500 font-mono">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-slate-400 uppercase">Title</Label>
                <Input
                  {...register('title')}
                  placeholder="e.g. AI Engineer"
                  className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
                />
                {errors.title && <p className="text-xs text-red-500 font-mono">{errors.title.message as string}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-mono text-xs text-slate-400 uppercase">Tagline</Label>
                <Input
                  {...register('tagline')}
                  placeholder="Tagline message"
                  className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
                />
                {errors.tagline && <p className="text-xs text-red-500 font-mono">{errors.tagline.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-slate-400 uppercase">Email Address</Label>
                <Input
                  {...register('email')}
                  placeholder="contact@workspace.ai"
                  className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
                />
                {errors.email && <p className="text-xs text-red-500 font-mono">{errors.email.message as string}</p>}
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-xs text-slate-400 uppercase">Location</Label>
                <Input
                  {...register('location')}
                  placeholder="City, Country"
                  className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Sidebar assets */}
        <div className="space-y-6">
          {/* Availability Status */}
          <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-mono text-xs font-semibold text-white uppercase">Work Availability</h4>
                <p className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">Toggle availability status</p>
              </div>
              <Switch
                checked={isAvailableValue}
                onCheckedChange={(checked) => setValue('isAvailableForWork', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-slate-400 uppercase">Years of Experience</Label>
              <Input
                type="number"
                {...register('yearsOfExperience', { valueAsNumber: true })}
                className="bg-[#101827]/70 border-slate-800 focus:border-[#00E5FF]/40 text-white"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-2">
              <Link2 className="w-4 h-4 text-[#00E5FF]" />
              <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Social Nodes</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">GitHub</Label>
                <Input
                  {...register('socialLinks.github')}
                  placeholder="https://github.com/..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">LinkedIn</Label>
                <Input
                  {...register('socialLinks.linkedin')}
                  placeholder="https://linkedin.com/in/..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Twitter / X</Label>
                <Input
                  {...register('socialLinks.twitter')}
                  placeholder="https://twitter.com/..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Personal Website</Label>
                <Input
                  {...register('socialLinks.website')}
                  placeholder="https://yourdomain.com"
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Phone Number</Label>
                <Input
                  {...register('socialLinks.phone')}
                  placeholder="+1 (555) 019-2834"
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">LeetCode Profile</Label>
                <Input
                  {...register('socialLinks.leetcode')}
                  placeholder="https://leetcode.com/u/..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Dev.to Profile</Label>
                <Input
                  {...register('socialLinks.devto')}
                  placeholder="https://dev.to/..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase">Medium Profile</Label>
                <Input
                  {...register('socialLinks.medium')}
                  placeholder="https://medium.com/@..."
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Asset URL mapping */}
          <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-2">
              <Link2 className="w-4 h-4 text-[#7C3AED]" />
              <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">Asset URIs</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Avatar Image URL</Label>
                <Input
                  {...register('profileImage')}
                  placeholder="Cloudinary image URL"
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Intro Video URL</Label>
                <Input
                  {...register('heroVideo')}
                  placeholder="Cloudinary video URL"
                  className="bg-[#101827]/70 border-slate-800 text-xs"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
