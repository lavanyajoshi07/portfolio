'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { codingActivitySettingsSchema } from '@/lib/coding-activity-validation'
import { Save, Settings2, Upload, Eye, EyeOff, LayoutGrid, BarChart3, Github, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import MediaUploader from '../components/MediaUploader'

export default function CodingActivityPage() {
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [uploaderOpen, setUploaderOpen] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(codingActivitySettingsSchema),
    defaultValues: {
      title: 'Coding Activity',
      subtitle: 'Real-time stats from GitHub, LeetCode, and other platforms',
      problemsSolved: '—',
      problemsSolvedSource: 'LeetCode • Codeforces',
      contributions: '—',
      contributionsSource: 'Total Contributions',
      publicRepos: '—',
      publicReposSource: 'GitHub',
      followers: '—',
      followersSource: 'GitHub',
      contributionGraphImage: '',
      contributionGraphAlt: 'GitHub Contribution Graph',
      graphImageDisplayMode: 'cover',
      totalContributions: '—',
      currentStreak: '—',
      longestStreak: '—',
      activeDays: '—',
      profileImage: '',
      profileName: '',
      profileUsername: '',
      profileBio: '',
      githubFollowers: '—',
      githubFollowing: '—',
      githubRepos: '—',
      githubContributions: '—',
      githubCurrentStreak: '—',
      githubProfileUrl: '',
      motivationalQuote: '',
      motivationalIcon: 'Activity',
      motivationalEmoji: '⚡',
      showOverviewCards: true,
      showContributionGraph: true,
      showGithubProfile: true,
      showMotivationalBanner: true,
    },
  })

  const watchProfileImage = watch('profileImage')

  const fetchSettings = async () => {
    setSettingsLoading(true)
    try {
      const res = await fetch('/api/coding-activity-settings')
      const result = await res.json()
      if (result.success && result.data) {
        reset(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Settings Error', description: 'Failed to load coding activity settings.', variant: 'destructive' })
    } finally {
      setSettingsLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const onSubmitSettings = async (data: any) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/coding-activity-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        toast({ title: 'Success', description: 'Coding Activity settings updated.' })
        fetchSettings()
      } else {
        toast({ title: 'Error', description: result.error || 'Failed saving settings.', variant: 'destructive' })
      }
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'Failed updating settings.', variant: 'destructive' })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Coding Activity Dashboard CMS
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Manually customize your GitHub & coding statistics layout
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitSettings)} className="space-y-6 max-w-5xl">
        {settingsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Syncing custom settings...</span>
          </div>
        ) : (
          <>
            {/* General Settings */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <Settings2 className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  1. General Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Section Title</Label>
                  <Input {...register('title')} className="bg-[#101827]/70 border-slate-800 text-white" />
                  {errors.title && <p className="text-xs text-red-500 font-mono mt-0.5">{errors.title.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Section Subtitle</Label>
                  <Input {...register('subtitle')} className="bg-[#101827]/70 border-slate-800 text-white" />
                </div>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <LayoutGrid className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  2. Stats Overview Cards
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Problems Solved */}
                <div className="space-y-3 border border-slate-900/60 p-4 rounded-lg bg-[#101827]/10">
                  <h4 className="font-mono text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">Problems Solved</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Static Value</Label>
                      <Input {...register('problemsSolved')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Source Platform</Label>
                      <Input {...register('problemsSolvedSource')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                  </div>
                </div>

                {/* Contributions */}
                <div className="space-y-3 border border-slate-900/60 p-4 rounded-lg bg-[#101827]/10">
                  <h4 className="font-mono text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">Contributions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Static Value</Label>
                      <Input {...register('contributions')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Source Platform</Label>
                      <Input {...register('contributionsSource')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                  </div>
                </div>

                {/* Public Repos */}
                <div className="space-y-3 border border-slate-900/60 p-4 rounded-lg bg-[#101827]/10">
                  <h4 className="font-mono text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">Public Repos</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Static Value</Label>
                      <Input {...register('publicRepos')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Source Platform</Label>
                      <Input {...register('publicReposSource')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                  </div>
                </div>

                {/* Followers */}
                <div className="space-y-3 border border-slate-900/60 p-4 rounded-lg bg-[#101827]/10">
                  <h4 className="font-mono text-xs text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">Followers</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Static Value</Label>
                      <Input {...register('followers')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Source Platform</Label>
                      <Input {...register('followersSource')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Graph Mini Stats */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <BarChart3 className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  3. Contribution Graph Mini Stats
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Total Contributions</Label>
                  <Input {...register('totalContributions')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Current Streak</Label>
                  <Input {...register('currentStreak')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Longest Streak</Label>
                  <Input {...register('longestStreak')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">Active Days</Label>
                  <Input {...register('activeDays')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                </div>
              </div>
            </div>

            {/* GitHub Profile */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <Github className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  4. GitHub Profile Sidebar
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Upload / Preview */}
                <div className="flex flex-col items-center gap-3 border border-slate-900 p-4 rounded-xl bg-[#101827]/20">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Avatar Preview</Label>
                  <div className="relative w-24 h-24 shrink-0 rounded-full border border-cyan-400/40 p-1 bg-[#0A1020] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={watchProfileImage || '/placeholder-avatar.png'}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/placeholder-avatar.png' }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUploaderOpen(true)}
                    className="w-full border-slate-800 bg-[#101827]/30 hover:bg-[#101827]/60 font-mono text-[10px] h-8"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>Upload Image</span>
                  </Button>
                  <Input type="hidden" {...register('profileImage')} />
                </div>

                {/* Profile Information */}
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Display Name</Label>
                      <Input {...register('profileName')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                      {errors.profileName && <p className="text-xs text-red-500 font-mono mt-0.5">{errors.profileName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-mono text-[9px] text-slate-500 uppercase">Username Handle</Label>
                      <Input {...register('profileUsername')} className="bg-[#101827]/70 border-slate-800 text-white h-9" />
                      {errors.profileUsername && <p className="text-xs text-red-500 font-mono mt-0.5">{errors.profileUsername.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Bio</Label>
                    <Textarea {...register('profileBio')} rows={2} className="bg-[#101827]/70 border-slate-800 text-white" />
                  </div>
                </div>
              </div>

              {/* Sidebar Stats and Link */}
              <div className="border-t border-slate-900 pt-4 space-y-3">
                <h4 className="font-mono text-xs text-white uppercase tracking-wider">Profile Statistics & Link</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Followers</Label>
                    <Input {...register('githubFollowers')} className="bg-[#101827]/70 border-slate-800 text-white text-xs h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Following</Label>
                    <Input {...register('githubFollowing')} className="bg-[#101827]/70 border-slate-800 text-white text-xs h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Repos</Label>
                    <Input {...register('githubRepos')} className="bg-[#101827]/70 border-slate-800 text-white text-xs h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Contributions</Label>
                    <Input {...register('githubContributions')} className="bg-[#101827]/70 border-slate-800 text-white text-xs h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[9px] text-slate-500 uppercase">Current Streak</Label>
                    <Input {...register('githubCurrentStreak')} className="bg-[#101827]/70 border-slate-800 text-white text-xs h-9" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <Label className="font-mono text-[9px] text-slate-500 uppercase">GitHub Profile URL</Label>
                  <Input {...register('githubProfileUrl')} placeholder="https://github.com/..." className="bg-[#101827]/70 border-slate-800 text-white font-mono text-xs h-9" />
                  {errors.githubProfileUrl && <p className="text-xs text-red-500 font-mono mt-0.5">{errors.githubProfileUrl.message}</p>}
                </div>
              </div>
            </div>

            {/* Motivational Banner */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <Quote className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  5. Motivational Quote Banner
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="font-mono text-[10px] text-slate-500 uppercase">Banner Quote Text</Label>
                  <Input {...register('motivationalQuote')} className="bg-[#101827]/70 border-slate-800 text-white" />
                  {errors.motivationalQuote && <p className="text-xs text-red-500 font-mono mt-0.5">{errors.motivationalQuote.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Lucide Icon</Label>
                    <Input {...register('motivationalIcon')} className="bg-[#101827]/70 border-slate-800 text-white font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] text-slate-500 uppercase">Emoji</Label>
                    <Input {...register('motivationalEmoji')} className="bg-[#101827]/70 border-slate-800 text-white text-center font-mono" />
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="glass-card bg-[#0A1020]/40 border border-[#00E5FF]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-900/60 pb-3">
                <Eye className="w-4.5 h-4.5 text-[#00E5FF]" />
                <h2 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                  6. Visibility Toggles
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 border border-slate-900/60 p-3 rounded-lg bg-[#101827]/10">
                  <Switch
                    checked={watch('showOverviewCards')}
                    onCheckedChange={(checked) => setValue('showOverviewCards', checked)}
                  />
                  <div>
                    <Label className="font-mono text-[9px] text-slate-300 uppercase block">Overview Cards</Label>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">Show/Hide Card grid</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border border-slate-900/60 p-3 rounded-lg bg-[#101827]/10">
                  <Switch
                    checked={watch('showContributionGraph')}
                    onCheckedChange={(checked) => setValue('showContributionGraph', checked)}
                  />
                  <div>
                    <Label className="font-mono text-[9px] text-slate-300 uppercase block">Contribution Graph</Label>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">Show/Hide graph image</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border border-slate-900/60 p-3 rounded-lg bg-[#101827]/10">
                  <Switch
                    checked={watch('showGithubProfile')}
                    onCheckedChange={(checked) => setValue('showGithubProfile', checked)}
                  />
                  <div>
                    <Label className="font-mono text-[9px] text-slate-300 uppercase block">Github Profile</Label>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">Show/Hide profile card</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border border-slate-900/60 p-3 rounded-lg bg-[#101827]/10">
                  <Switch
                    checked={watch('showMotivationalBanner')}
                    onCheckedChange={(checked) => setValue('showMotivationalBanner', checked)}
                  />
                  <div>
                    <Label className="font-mono text-[9px] text-slate-300 uppercase block">Motivational Banner</Label>
                    <span className="text-[8px] font-mono text-slate-500 uppercase">Show/Hide quote row</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Controls */}
            <div className="flex justify-end font-mono text-xs uppercase tracking-wider pt-4">
              <Button
                type="submit"
                disabled={actionLoading}
                className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white py-6 px-8 shadow-lg shadow-[#00E5FF]/10"
              >
                <Save className="w-4 h-4 mr-2" />
                <span>{actionLoading ? 'Saving...' : 'Save Settings'}</span>
              </Button>
            </div>
          </>
        )}
      </form>

      {/* Upload Media Dialog Modal */}
      <Dialog open={uploaderOpen} onOpenChange={setUploaderOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Upload Avatar Image File
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <MediaUploader
              allowedTypes={['image/*']}
              onUploadSuccess={(asset) => {
                setValue('profileImage', asset.url)
                toast({ title: 'Success', description: 'Avatar uploaded to media assets.' })
                setUploaderOpen(false)
              }}
              onClose={() => setUploaderOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
