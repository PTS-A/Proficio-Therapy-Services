import React from 'react';
import fullLogoImg from '../../assets/images/proficio_brand_logo_1787774889684.jpg';
import markLogoImg from '../../assets/images/proficio_logo_mark_1787774592577.jpg';

interface ProficioLogoProps {
  variant?: 'full' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const ProficioLogo: React.FC<ProficioLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  const heightClass = 
    size === 'sm' ? 'h-9' : 
    size === 'md' ? 'h-12 sm:h-14' : 
    size === 'lg' ? 'h-16 sm:h-20' : 
    size === 'xl' ? 'h-24 sm:h-28' : 
    size === '2xl' ? 'h-32 sm:h-36' : 
    'h-12 sm:h-14';

  const logoSrc = variant === 'mark' ? markLogoImg : fullLogoImg;

  return (
    <img
      src={logoSrc}
      alt="Proficio Therapy - An EdTheory Affiliate"
      referrerPolicy="no-referrer"
      className={`${heightClass} w-auto object-contain select-none shrink-0 ${className}`}
    />
  );
};
