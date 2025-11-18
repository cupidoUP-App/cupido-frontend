import React from 'react';
import { ParticlesComponent } from '../../../home/components/Particles';

interface RightSideWithParticlesProps {
  children?: React.ReactNode;
}

const RightSideWithParticles: React.FC<RightSideWithParticlesProps> = ({ 
  children 
}) => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full overflow-hidden">
      {/* Efecto de partículas en toda la mitad derecha */}
      <div className="absolute inset-0 z-0">
        <ParticlesComponent id="right-side-particles" />
      </div>
      
      {/* Contenido children (opcional) */}
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default RightSideWithParticles;