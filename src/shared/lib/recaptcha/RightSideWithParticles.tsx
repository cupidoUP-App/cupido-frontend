import React, { lazy, Suspense } from 'react';
// Lazy load particles to reduce initial bundle size
const ParticlesComponent = lazy(() => import('@home/components/Particles').then(m => ({ default: m.ParticlesComponent })));

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
        <Suspense fallback={null}>
          <ParticlesComponent id="complete-register-particles" />
        </Suspense>
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