/**
 * Reusable Card Component
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${
        hoverable ? 'transition-shadow hover:shadow-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
