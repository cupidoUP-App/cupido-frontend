import React from 'react';

interface ThemeTransitionOverlayProps {
  theme: string;
}

const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({ theme }) => {
  const overlayBgColor = `hsl(var(--background))`;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in-out"
      style={{ backgroundColor: overlayBgColor }}
    >
      {/* You can add a spinner or logo here if desired */}
    </div>
  );
};

export default ThemeTransitionOverlay;
