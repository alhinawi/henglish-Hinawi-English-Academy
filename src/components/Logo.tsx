import React, { useState } from 'react';
import { LOGO_BASE64 } from '../assets/logoBase64';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  glow = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/logo-clean.png');

  const sizeMap = {
    sm: { box: 'w-9 h-9', px: 36, text: 'text-sm', tag: 'text-[10px]' },
    md: { box: 'w-12 h-12', px: 48, text: 'text-base', tag: 'text-xs' },
    lg: { box: 'w-16 h-16', px: 64, text: 'text-xl', tag: 'text-xs' },
    xl: { box: 'w-24 h-24', px: 96, text: 'text-2xl', tag: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none shrink-0 ${className}`}>
      {/* Eagle Icon with Neon Glow */}
      <div 
        className={`relative ${currentSize.box} shrink-0 flex items-center justify-center`}
        style={{ width: currentSize.px, height: currentSize.px }}
      >
        {glow && (
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffd166]/30 via-[#ff4f9a]/20 to-[#41e7ff]/30 blur-md -z-10 animate-pulse pointer-events-none" 
            aria-hidden="true" 
          />
        )}
        <img
          src={imgSrc}
          alt="Hinawi English Eagle Logo"
          width={currentSize.px}
          height={currentSize.px}
          onError={() => {
            // Fallback to embedded base64 if network image fails
            setImgSrc(LOGO_BASE64);
          }}
          className={`${currentSize.box} shrink-0 object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_0_12px_rgba(255,209,102,0.4)]`}
          loading="eager"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col text-right leading-tight shrink-0">
          <span className={`font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-wider text-[#ffd166] uppercase ${currentSize.text} whitespace-nowrap`}>
            HINAWI ENGLISH
          </span>
          <span className={`text-[#b9b6d5] font-semibold tracking-wide ${currentSize.tag} whitespace-nowrap mt-0.5`}>
            Learn it. Use it. Own it.
          </span>
        </div>
      )}
    </div>
  );
};
