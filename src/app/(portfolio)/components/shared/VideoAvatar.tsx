'use client'

export default function VideoAvatar() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <video
        src="/videos/avatar.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-24 h-24 rounded-full border-2 border-pink-500 shadow-lg"
      />
    </div>
  )
}
