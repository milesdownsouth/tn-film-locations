'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface LottieLoaderProps {
  message?: string;
  size?: number;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
  message = 'Loading...',
  size = 150
}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Fetch the camera shutter animation
    fetch('/camera-shutter.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  if (!animationData) {
    // Fallback to simple spinner if animation fails to load
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
        {message && (
          <p className="mt-4 text-gray-600">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div style={{ width: size, height: size }}>
        <Lottie
          animationData={animationData}
          loop={true}
          autoplay={true}
        />
      </div>
      {message && (
        <p className="mt-4 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LottieLoader;
