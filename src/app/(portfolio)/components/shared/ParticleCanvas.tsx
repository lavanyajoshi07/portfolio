'use client'

export default function ParticleCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050816]" aria-hidden="true">
      {/* Subtle blue radial glow in the top-left */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full opacity-[0.2] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, transparent 70%)',
          filter: 'blur(100px)'
        }}
      />
      {/* Subtle purple radial glow in the bottom-right */}
      <div 
        className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full opacity-[0.15] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, transparent 70%)',
          filter: 'blur(120px)'
        }}
      />
      {/* Ultra-low-opacity grid pattern (2.5% opacity) */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 229, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  )
}
