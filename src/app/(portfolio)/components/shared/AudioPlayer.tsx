'use client'

export default function AudioPlayer() {
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio controls className="bg-slate-900 rounded-lg p-2">
        <source src="/audio/intro.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
