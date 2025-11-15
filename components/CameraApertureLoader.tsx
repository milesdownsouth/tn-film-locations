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
  const bladesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!bladesRef.current) return;

    const blades = bladesRef.current.querySelectorAll('.aperture-blade');

    // Create a timeline for the aperture animation
    const tl = gsap.timeline({ repeat: -1 });

    // Closing animation
    tl.to(blades, {
      rotation: 45,
      transformOrigin: 'center center',
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: {
        each: 0.05,
        from: 'start',
      },
    });

    // Opening animation
    tl.to(blades, {
      rotation: 0,
      transformOrigin: 'center center',
      duration: 0.8,
      ease: 'power2.inOut',
      stagger: {
        each: 0.05,
        from: 'start',
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="camera-aperture"
      >
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#C41E3A"
          strokeWidth="2"
        />

        {/* Aperture blades container */}
        <g ref={bladesRef}>
          {/* Create 8 aperture blades */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <g
                key={i}
                className="aperture-blade"
                transform={`rotate(${angle} 50 50)`}
              >
                <path
                  d="M 50 50 L 50 10 L 60 20 L 50 50 Z"
                  fill="#C41E3A"
                  opacity="0.8"
                />
              </g>
            );
          })}
        </g>

        {/* Center circle */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#C41E3A"
        />
      </svg>

      {message && (
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
}
