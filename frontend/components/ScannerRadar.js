"use client";

import { useEffect, useRef } from "react";

export default function ScannerRadar() {
  const radarRef = useRef(null);

  useEffect(() => {
    const canvas = radarRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angle = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.9;

      // Background fade
      ctx.fillStyle = "rgba(10, 15, 29, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow effect
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, "rgba(0, 255, 255, 0.15)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + 0.15); // rotating beam
      ctx.closePath();
      ctx.fill();

      angle += 0.005;
      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <canvas
      ref={radarRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ position: "absolute", top: 0, left: 0 }}
    />
  );
}
