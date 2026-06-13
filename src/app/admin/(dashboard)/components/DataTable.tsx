'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchKey?: keyof T
  searchPlaceholder?: string
  loading?: boolean
  actions?: (item: T) => React.ReactNode
}

export default function DataTable<T>({
  data,
  columns,
  searchKey,
  searchPlaceholder = 'Query parameters...',
  loading = false,
  actions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filter data
  const filteredData = data.filter((item) => {
    if (!searchKey || !searchQuery) return true
    const val = item[searchKey]
    if (typeof val === 'string') {
      return val.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return false
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      {/* Search Filter Header */}
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute inset-y-0 left-3 my-auto h-4 w-4 text-slate-500" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-[#101827]/60 border-slate-800 text-white focus:border-[#00E5FF]/40 focus:ring-0 placeholder-slate-600 font-mono text-xs uppercase tracking-wider"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="glass-card bg-[#0A1020]/60 border border-[#00E5FF]/10 rounded-xl overflow-hidden relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00E5FF]/10 bg-[#101827]/40 font-mono text-xs uppercase tracking-widest text-[#00E5FF]/80">
                {columns.map((col, idx) => (
                  <th key={idx} className={`p-4 font-semibold ${col.className ?? ''}`}>
                    {col.header}
                  </th>
                ))}
                {actions && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 font-sans text-sm">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="w-6 h-6 rounded-full border-2 border-[#00E5FF] border-t-transparent animate-spin" />
                      <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">Syncing node index...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <Inbox className="w-8 h-8 text-slate-700" />
                      <span className="font-mono text-xs uppercase tracking-wider">Empty node array: No records logged</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-900/20 text-slate-300 transition-colors duration-150">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`p-4 ${col.className ?? ''}`}>
                        {typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : (item[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                    {actions && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {actions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-[#00E5FF]/10 bg-[#101827]/20 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-slate-500">
            <span>
              Showing Page {currentPage} of {totalPages} ({filteredData.length} records total)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 border-slate-800 bg-[#101827]/40 hover:bg-slate-900/60"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
