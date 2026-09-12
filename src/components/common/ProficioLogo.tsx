import React from 'react';
import fullLogoImg from '../../assets/images/Proficio-Logo-with-Family.png';
import markLogoImg from '../../assets/images/Proficio-Logo-Mark.png';
import horizontalLogoImg from '../../assets/images/Proficio-Therapy-Horizontal.png';

interface ProficioLogoProps {
  variant?: 'full' | 'mark' | 'brand' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const ProficioLogo: React.FC<ProficioLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const heightClass = 
    size === 'sm' ? 'h-8 sm:h-9' : 
    size === 'md' ? 'h-12 sm:h-14' : 
    size === 'lg' ? 'h-16 sm:h-20' : 
    size === 'xl' ? 'h-24 sm:h-28' : 
    size === '2xl' ? 'h-32 sm:h-36' : 
    'h-12 sm:h-14';

  const logoSrc = 
    variant === 'mark' ? markLogoImg : 
    (variant === 'brand' || variant === 'horizontal') ? horizontalLogoImg : 
    fullLogoImg;

  return (
    <img
      src={logoSrc}
      alt="Proficio Therapy Family of Companies"
      referrerPolicy="no-referrer"
      className={`${heightClass} w-auto object-contain select-none shrink-0 ${className}`}
    />
  );
};

