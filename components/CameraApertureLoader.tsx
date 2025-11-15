'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CameraApertureLoaderProps {
  size?: number;
  message?: string;
}

export default function CameraApertureLoader({
  size = 100,
  message
}: CameraApertureLoaderProps) {
  const shuttersRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!shuttersRef.current) return;

    const shutter1 = shuttersRef.current.querySelector('#shutter1');
    const shutter2 = shuttersRef.current.querySelector('#shutter2');
    const shutter3 = shuttersRef.current.querySelector('#shutter3');
    const shutter4 = shuttersRef.current.querySelector('#shutter4');
    const shutter5 = shuttersRef.current.querySelector('#shutter5');
    const shutter6 = shuttersRef.current.querySelector('#shutter6');
    const shutter7 = shuttersRef.current.querySelector('#shutter7');
    const shutter8 = shuttersRef.current.querySelector('#shutter8');

    // Animation timeline
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.3 });

    // Animate each blade with rotation
    const SPEED = 0.5;
    const ROTATION = 60;

    tl.to(shutter1, { rotation: ROTATION, transformOrigin: '39% 87%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter2, { rotation: ROTATION, transformOrigin: '14% 78%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter3, { rotation: ROTATION, transformOrigin: '8% 50%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter4, { rotation: ROTATION, transformOrigin: '18% 18%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter5, { rotation: ROTATION, transformOrigin: '50% 10%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter6, { rotation: ROTATION, transformOrigin: '82% 18%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter7, { rotation: ROTATION, transformOrigin: '92% 50%', duration: SPEED, ease: 'expo.inOut' }, 0)
      .to(shutter8, { rotation: ROTATION, transformOrigin: '78% 82%', duration: SPEED, ease: 'expo.inOut' }, 0);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        id="shutters_svg"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 1001.5 996.5"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        <g id="shutters" ref={shuttersRef}>
          <path
            id="shutter1"
            d="M495.6,509C466.2,673.8,390.8,839,296,1000H707C704,784.9,608.2,584.6,495.6,509Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter2"
            d="M296,1000c90.9-137,167-319,203-499C368,593,201.3,655.6,0,707Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter3"
            d="M0,707V295c142.6,85.4,302.9,158.8,499,208C363.2,592.2,198.6,661.4,0,707Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter4"
            d="M290,4,0,295.8C180.2,401.6,334.3,464.8,498,501,396,354.6,310,60.8,290,4Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter5"
            d="M290,4H709C622.7,137.4,560.5,310.4,498,499,400.1,346.2,335.5,170.8,290,4Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter6"
            d="M1001.5,292.5,705.8,3.5C619.9,146.2,563.7,301.6,498,500,646.3,398.3,944,312.5,1001.5,292.5Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter7"
            d="M999,294.9l.2,422.9C854.5,630.2,691.9,554.9,492.9,504.5,593.7,433,779.3,358.7,999,294.9Z"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
          <path
            id="shutter8"
            d="M499,509c169.3,38.9,335.9,109.1,500,209L707,1000c-6-259-117-423-208-491"
            transform="translate(0 -3.5)"
            fill="#C41E3A"
            strokeWidth="2"
            stroke="#8B1229"
          />
        </g>
      </svg>

      {message && (
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
}
