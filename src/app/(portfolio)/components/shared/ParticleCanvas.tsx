import React from 'react';

// Simple particle background placeholder
export default function ParticleCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* You can replace this with a canvas or animation library */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
