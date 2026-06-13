import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00E5FF]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF4FD8]/10 blur-[150px] pointer-events-none" />
      
      {/* Cyberpunk grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #101827 1px, transparent 1px),
            linear-gradient(to bottom, #101827 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md p-4">
        {children}
      </div>
    </div>
  )
}
