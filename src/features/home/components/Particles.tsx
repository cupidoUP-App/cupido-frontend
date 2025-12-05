import { useAppStore } from "@store/appStore";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

import { loadHeartShape } from "@tsparticles/shape-heart";

export const ParticlesComponent = (props: { id?: string }) => {
  //const { theme } = useAppStore();
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      await loadHeartShape(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: {
          value: "transparent",
        },
      },
      fullScreen: {
        enable: false,
        zIndex: 0,
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          grab: {
            distance: 120,
            links: {
              opacity: 0.2,
              color: "#D9857E",
            },
          },
        },
      },
      particles: {
        color: {
          value: ['#D9857E', '#E8A5A0', '#C4706A'],
        },
        shape: {
          type: 'heart',
        },
        number: {
          density: {
            enable: true,
            area: 900,
          },
          value: 25,
        },
        opacity: {
          value: { min: 0.2, max: 0.5 },
          animation: {
            enable: true,
            speed: 0.3,
            minimumValue: 0.15,
            sync: false,
          },
        },
        size: {
          value: { min: 4, max: 12 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 3,
            sync: false,
          },
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.4,
          straight: false,
          warp: false,
          attract: {
            enable: false,
          },
        },

      },
      detectRetina: true,
    }),
    [],
  );


  if (init) {
    return (
      <Particles
        id={props.id}
        particlesLoaded={particlesLoaded}
        options={options}
        className="absolute inset-0"
      />
    );
  }

  return <></>;
};