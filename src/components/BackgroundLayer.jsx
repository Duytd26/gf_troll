import React, { useState } from 'react';
import girlfriendImg from '../assets/girlfriend.jpg';

export default function BackgroundLayer() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none select-none">
      {/* Warm ambient foundation matching the sticker photo base tone */}
      <div className="absolute inset-0 bg-[#F7F3EB]" />

      {/* Main girlfriend image — bright, warm, emotionally present */}
      {!imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={girlfriendImg}
            alt="My Love"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-[center_35%] transition-all duration-1000 ease-out ${
              imageLoaded ? 'opacity-70 sm:opacity-60 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        </div>
      )}

      {/* Controlled warm ambient veil for flawless text contrast without muddying the photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FBF8F3]/60 via-[#F9F5EE]/40 to-[#F5EFE4]/75" />
      
      {/* Soft radial focus mask: keeps center subtly softened for the card, while letting stickers shine around */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,rgba(247,243,235,0.2)_60%,rgba(235,225,212,0.65)_100%)]" />

      {/* Delicate warm vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(180,140,130,0.15)]" />
    </div>
  );
}

