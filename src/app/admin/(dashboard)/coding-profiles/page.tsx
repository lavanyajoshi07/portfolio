'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { codingProfileSchema } from '@/lib/validation'
import { Plus, Trash2, RefreshCw, Terminal, Globe, Flame, GitCommit, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/useToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import DataTable from '../components/DataTable'
import ConfirmDialog from '../components/ConfirmDialog'

interface CodingProfile {
  _id: string
  platform: 'github' | 'leetcode' | 'hackerrank' | 'codechef' | 'codeforces' | 'other'
  username: string
  profileUrl?: string
  displayData?: {
    totalSolved?: number
    streak?: number
    contributions?: number
    followers?: number
    publicRepos?: number
    ranking?: number
  }
  enabled: boolean
  lastSynced?: string
}

const PLATFORMS = [
  { value: 'github', label: 'GitHub' },
  { value: 'leetcode', label: 'LeetCode' },
  { value: 'hackerrank', label: 'HackerRank' },
  { value: 'codechef', label: 'CodeChef' },
  { value: 'codeforces', label: 'Codeforces' },
  { value: 'other', label: 'Other Platform' },
]

export default function CodingProfilesPage() {
  const [profiles, setProfiles] = useState<CodingProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(codingProfileSchema),
    defaultValues: {
      platform: 'github' as any,
      username: '',
      enabled: true,
    },
  })

  const enabledValue = watch('enabled')

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/coding-profiles')
      const result = await res.json()
      if (result.success) {
        setProfiles(result.data)
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Query Error',
        description: 'Failed to retrieve coding profiles logs.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleOpenCreate = () => {
    reset({
      platform: 'github',
      username: '',
      enabled: true,
    })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/coding-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Database Synced',
          description: 'Coding profile created and synced.',
        })
        setDialogOpen(false)
        fetchProfiles()
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
        title: 'Transmission Error',
        description: 'Failed to deploy profile node.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSync = async (id: string) => {
    setSyncingId(id)
    try {
      const res = await fetch(`/api/coding-profiles/${id}/sync`, {
        method: 'POST',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Synchronized',
          description: 'Platform profile statistics updated successfully.',
        })
        fetchProfiles()
      } else {
        toast({
          title: 'Sync Failed',
          description: result.error || 'Check platform connectivity or rate-limit.',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Sync Protocol Fault',
        description: 'Failed to complete synchronization packet.',
        variant: 'destructive',
      })
    } finally {
      setSyncingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setActionLoading(true)

    try {
      const res = await fetch(`/api/coding-profiles/${deleteId}`, {
        method: 'DELETE',
      })
      const result = await res.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Integration entry purged.',
        })
        setDeleteId(null)
        fetchProfiles()
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Purge failed',
          variant: 'destructive',
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: 'Error',
        description: 'Failed to destroy profile node.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const columns = [
    {
      header: 'Platform Node',
      accessor: (item: CodingProfile) => (
        <div className="flex items-center gap-3">
          <Terminal className="w-4.5 h-4.5 text-[#00E5FF]" />
          <div>
            <span className="font-semibold text-slate-200 block uppercase tracking-wider">{item.platform}</span>
            <span className="text-[10px] text-slate-500 font-mono">@{item.username}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Integrated Statistics',
      accessor: (item: CodingProfile) => {
        if (!item.displayData) return <span className="text-slate-600 font-mono text-xs">NO METRIC DATA LOGGED</span>
        
        return (
          <div className="flex items-center gap-4 text-slate-400 font-mono text-xs">
            {item.platform === 'github' ? (
              <>
                <div className="flex items-center gap-1">
                  <GitCommit className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Commits: {item.displayData.contributions || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Repos: {item.displayData.publicRepos || 0}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>Solved: {item.displayData.totalSolved || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#FF4FD8]" />
                  <span>Streak: {item.displayData.streak || 0}d</span>
                </div>
              </>
            )}
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: (item: CodingProfile) => (
        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded-full ${
          item.enabled 
            ? 'bg-green-950/20 text-green-400 border border-green-500/20' 
            : 'bg-slate-900 text-slate-500 border border-slate-800'
        }`}>
          {item.enabled ? 'Active' : 'Offline'}
        </span>
      ),
    },
    {
      header: 'Last Synced',
      accessor: (item: CodingProfile) => (
        <span className="font-mono text-xs text-slate-500">
          {item.lastSynced ? new Date(item.lastSynced).toLocaleString() : 'Never'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white uppercase tracking-wider">
            Platform Integrations
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
            Synchronize external coding profiles and streaks
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={fetchProfiles}
            className="border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </Button>
          <Button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-white font-mono text-xs uppercase tracking-wider py-5 px-6 shadow-lg shadow-[#00E5FF]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Connect Profile</span>
          </Button>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={profiles}
        columns={columns}
        loading={loading}
        actions={(item: CodingProfile) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSync(item._id)}
              disabled={syncingId === item._id}
              className="border-slate-800 hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 text-slate-400 hover:text-white font-mono text-[10px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1 ${syncingId === item._id ? 'animate-spin' : ''}`} />
              <span>{syncingId === item._id ? 'Syncing...' : 'Sync'}</span>
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

      {/* Add dialog modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#0A1020] border border-[#00E5FF]/20 text-slate-200 rounded-xl max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
              Establish Platform Node
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Platform Provider</Label>
              <select
                {...register('platform')}
                className="w-full bg-[#101827]/70 border border-slate-800 rounded-lg text-slate-300 p-2.5 text-xs font-mono uppercase focus:border-[#00E5FF]/40 outline-none"
              >
                {PLATFORMS.map((plat) => (
                  <option key={plat.value} value={plat.value} className="bg-[#0A1020]">
                    {plat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-mono text-[10px] text-slate-500 uppercase">Username / ID</Label>
              <Input
                {...register('username')}
                placeholder="Operator name on target platform"
                className="bg-[#101827]/70 border-slate-800 text-white"
              />
              {errors.username && <p className="text-xs text-red-500 font-mono">{errors.username.message as string}</p>}
            </div>

            <div className="flex items-center gap-3 py-2 border-t border-slate-900 mt-2">
              <Switch
                checked={enabledValue}
                onCheckedChange={(checked) => setValue('enabled', checked)}
              />
              <div>
                <Label className="font-mono text-[10px] text-slate-300 uppercase">Enabled Status</Label>
                <p className="text-[9px] font-mono text-slate-500 uppercase">Integrate data views</p>
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
                {actionLoading ? 'Connecting...' : 'Establish Node'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        title="Destroy Integration Node"
        description="Warning: Purging this integration will remove all cached statistics, streaks, and chart heatmaps from public visualizers."
      />
    </div>
  )
}
