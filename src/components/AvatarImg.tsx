import React, { useState } from 'react';

interface AvatarImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Name used for the initial-letter fallback when the image fails to load. */
  name?: string;
}

/**
 * Avatar image with a safe fallback: when the URL is missing or fails to
 * load, render the person's first initial on a branded tile instead of the
 * browser's broken-image icon.
 */
export const AvatarImg: React.FC<AvatarImgProps> = ({ name, className, alt, src, ...rest }) => {
  const [broken, setBroken] = useState(false);
  if (broken || !src) {
    const initial = (name || alt || '?').trim().charAt(0).toUpperCase() || '?';
    return (
      <span
        role="img"
        aria-label={alt || name}
        className={`${className ?? ''} inline-flex items-center justify-center bg-[#2a2750] text-[#ffd166] font-black select-none`}
      >
        {initial}
      </span>
    );
  }
  return <img {...rest} src={src} alt={alt} className={className} onError={() => setBroken(true)} />;
};
