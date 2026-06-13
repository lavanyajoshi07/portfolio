export default function SectionLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyan-DEFAULT animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-violet-DEFAULT animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-pink-DEFAULT animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}