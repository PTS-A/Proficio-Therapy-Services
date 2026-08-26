import React from 'react';

interface ProficioLogoProps {
  variant?: 'full' | 'compact' | 'icon-only' | 'white-text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProficioLogo: React.FC<ProficioLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
}) => {
  // Dimension scaling
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.35 : size === 'xl' ? 1.8 : 1.0;
  const iconWidth = Math.round(52 * scale);
  const iconHeight = Math.round(44 * scale);

  // SVG 4-interlocking rectangles Mark
  const LogoMark = (
    <svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 110 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs"
    >
      {/* Top-Left: Orange Rectangle */}
      <rect
        x="22"
        y="4"
        width="38"
        height="50"
        rx="2.5"
        stroke="#E86424"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.05"
      />

      {/* Bottom-Left: Royal Blue Rectangle */}
      <rect
        x="6"
        y="36"
        width="38"
        height="52"
        rx="2.5"
        stroke="#2B4C9D"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.05"
      />

      {/* Top-Right: Vibrant Green Rectangle */}
      <rect
        x="64"
        y="6"
        width="38"
        height="50"
        rx="2.5"
        stroke="#00A651"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.05"
      />

      {/* Bottom-Right: Golden Yellow Rectangle */}
      <rect
        x="48"
        y="36"
        width="38"
        height="52"
        rx="2.5"
        stroke="#F5A623"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
        fillOpacity="0.05"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoMark}</div>;
  }

  const isWhiteText = variant === 'white-text';

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {LogoMark}

      <div className="flex flex-col">
        {/* Main "Proficio" */}
        <div className="flex items-baseline">
          <span
            className={`font-black tracking-tight leading-none ${
              isWhiteText ? 'text-white' : 'text-[#2B4C9D]'
            }`}
            style={{
              fontSize: `${Math.round(26 * scale)}px`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            Proficio
          </span>
        </div>

        {/* Subtitle "THERAPY" */}
        <div className="mt-0.5">
          <span
            className="font-bold tracking-[0.38em] leading-none text-[#00A651] uppercase"
            style={{
              fontSize: `${Math.max(9, Math.round(11 * scale))}px`,
              fontWeight: 800,
            }}
          >
            THERAPY
          </span>
        </div>

        {/* Tagline "AN EDTHEORY AFFILIATE" */}
        {variant === 'full' && (
          <div className="mt-1 flex items-center space-x-1 tracking-[0.24em] uppercase font-bold text-[8px] sm:text-[9px]">
            <span className={isWhiteText ? 'text-slate-300' : 'text-[#2B4C9D]'}>AN</span>
            <span className="text-[#0D9488]">ED</span>
            <span className="text-[#E86424]">THEORY</span>
            <span className={isWhiteText ? 'text-slate-300' : 'text-[#2B4C9D]'}>AFFILIATE</span>
          </div>
        )}
      </div>
    </div>
  );
};
