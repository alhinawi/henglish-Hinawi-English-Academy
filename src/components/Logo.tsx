import React from 'react';

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
  const sizeMap = {
    sm: { img: 'w-9 h-9', text: 'text-sm', tag: 'text-[10px]' },
    md: { img: 'w-12 h-12', text: 'text-base', tag: 'text-xs' },
    lg: { img: 'w-16 h-16', text: 'text-xl', tag: 'text-xs' },
    xl: { img: 'w-24 h-24', text: 'text-2xl', tag: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {glow && (
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ffd166]/25 to-[#41e7ff]/25 blur-md -z-10 animate-pulse"
            aria-hidden="true"
          />
        )}
        <img
          src="/logo-clean.png"
          alt="Hinawi English Eagle Logo"
          className={`${currentSize.img} object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_0_12px_rgba(255,209,102,0.35)]`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col text-right">
          <span className={`font-black font-['Plus_Jakarta_Sans',sans-serif] tracking-wider text-[#ffd166] uppercase ${currentSize.text} leading-tight`}>
            HINAWI ENGLISH
          </span>
          <span className={`text-[#b9b6d5] font-semibold tracking-wide ${currentSize.tag} leading-tight`}>
            Learn it. Use it. Own it.
          </span>
        </div>
      )}
    </div>
  );
};
