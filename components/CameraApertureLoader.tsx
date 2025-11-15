'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CameraApertureLoaderProps {
  size?: number;
  message?: string;
}

export default function CameraApertureLoader({
  size = 80,
  message
}: CameraApertureLoaderProps) {
  const apertureRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!apertureRef.current) return;

    const blades = apertureRef.current.querySelectorAll('.blade');

    // Create continuous opening/closing animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.2 });

    // Animate blades - each blade rotates from its pivot point
    blades.forEach((blade, index) => {
      tl.to(blade, {
        rotation: 30,
        duration: 0.6,
        ease: 'power2.inOut',
      }, index * 0.02); // Slight stagger for each blade
    });

    return () => {
      tl.kill();
    };
  }, []);

  // Blade positions and transform origins for realistic iris effect
  const bladeConfig = [
    { angle: 0, origin: '50% 85%' },
    { angle: 45, origin: '15% 80%' },
    { angle: 90, origin: '10% 50%' },
    { angle: 135, origin: '15% 20%' },
    { angle: 180, origin: '50% 15%' },
    { angle: 225, origin: '85% 20%' },
    { angle: 270, origin: '90% 50%' },
    { angle: 315, origin: '85% 80%' },
  ];

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        ref={apertureRef}
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="camera-aperture"
      >
        {/* Outer camera lens ring */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#C41E3A"
          strokeWidth="3"
        />

        {/* Inner decorative ring */}
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="#C41E3A"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Aperture blade group */}
        <g className="blades">
          {bladeConfig.map((config, i) => (
            <g
              key={i}
              className="blade"
              transform={`rotate(${config.angle} 100 100)`}
              style={{ transformOrigin: config.origin }}
            >
              {/* Realistic aperture blade - curved pentagon shape */}
              <path
                d="M 100 35
                   Q 95 60 92 85
                   L 92 95
                   L 108 95
                   L 108 85
                   Q 105 60 100 35 Z"
                fill="#C41E3A"
                stroke="#8B1229"
                strokeWidth="0.8"
                opacity="0.92"
              />
              {/* Blade highlight for depth */}
              <path
                d="M 100 35 Q 97 55 95 80 L 98 80 Q 99 55 100 35 Z"
                fill="#E63946"
                opacity="0.3"
              />
            </g>
          ))}
        </g>

        {/* Center aperture opening (gets smaller when blades close) */}
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="#1a1a1a"
          opacity="0.4"
        />

        {/* Very center point */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="#C41E3A"
        />
      </svg>

      {message && (
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
}
