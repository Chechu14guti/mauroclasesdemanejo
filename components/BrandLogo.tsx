import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'dark' | 'light'; // dark means dark text (for white bg), light means white text (for dark bg)
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-12 h-12", showText = true, variant = 'light' }) => {
  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900';

  return (
    <div className="flex flex-col items-center gap-2">
        <div className={`${className} text-orange-500`}>
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                {/* Rim */}
                <circle cx="50" cy="50" r="42" />
                {/* Center Pad */}
                <circle cx="50" cy="50" r="12" fill="currentColor" stroke="none" />
                {/* Spokes */}
                <path d="M 50 62 L 50 92" /> {/* Bottom Spoke */}
                <path d="M 38 50 L 8 50" />   {/* Left Spoke */}
                <path d="M 62 50 L 92 50" />  {/* Right Spoke */}
                {/* Detail: Grip bumps */}
                <path d="M 20 20 Q 50 5 80 20" stroke="none" fill="currentColor" opacity="0.1" />
            </svg>
        </div>
        {showText && (
            <div className="text-center leading-none">
                <h1 className={`text-2xl font-black tracking-tight ${textColor}`}>MAURO</h1>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-1">Clases de Manejo</p>
            </div>
        )}
    </div>
  );
};

export default BrandLogo;