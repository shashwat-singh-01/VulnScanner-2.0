"use client";

import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="scanner-theme"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "#0a0f1d" },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: ["grab", "bubble"], // combo mode!
              },
              onClick: {
                enable: false,
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 180,
                links: {
                  opacity: 0.5,
                },
              },
              bubble: {
                distance: 150,
                size: 6,
                duration: 2,
                opacity: 0.8,
                color: {
                  value: "#00ffff",
                },
              },
            },
          },
          
        particles: {
          number: {
            value: 200,
            density: { enable: true, area: 1000 },
          },
          color: {
            value: ["#00ffff", "#ff00ff", "#39ff14", "#ff6ec7", "#8be9fd"],
            animation: {
              enable: true,
              speed: 30,     // Adjust speed for color change
              sync: false,   // false = wave-like, true = all change together
            },
          },
          
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1.5, max: 2.5 },
            animation: {
              enable: true,
              speed: 2,
              sync: false,
            },
          },
          links: {
            enable: true,
            distance: 120,
            color: "#00ffe1",
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce",
            },
            trail: {
              enable: true,
              length: 3,
              fillColor: "#0a0f1d",
            },
          },
          opacity: {
            value: 0.6,
            animation: {
              enable: true,
              speed: 1.5,
              minimumValue: 0.3,
              sync: false,
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
