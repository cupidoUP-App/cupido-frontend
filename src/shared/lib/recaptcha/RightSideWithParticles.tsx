import React from 'react';
import { ParticlesComponent } from '@home/components/Particles';

interface RightSideWithParticlesProps {
  children?: React.ReactNode;
  className?: string;
}

const RightSideWithParticles: React.FC<RightSideWithParticlesProps> = React.memo(({ 
  children,
  className = ""
}) => {
  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}>
      {/* Efecto de partículas en toda la pantalla */}
      <div className="absolute inset-0 z-0">
        <ParticlesComponent id="complete-register-particles" />
      </div>
      
      {/* Contenido children */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
});


RightSideWithParticles.displayName = 'RightSideWithParticles';

export default RightSideWithParticles;