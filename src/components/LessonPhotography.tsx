import React from 'react';
import { type LessonPhotograph } from '../data/lessonPhotography';

/** Same-origin assets, with reserved dimensions and no decorative animation. */
export const LessonPhoto: React.FC<{ photo: LessonPhotograph; priority?: boolean; className?: string }> = ({ photo, priority = false, className = '' }) => (
  <img src={photo.src} alt={photo.alt} width={1100} height={733}
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'}
    decoding="async" className={`block w-full object-cover ${className}`} />
);
