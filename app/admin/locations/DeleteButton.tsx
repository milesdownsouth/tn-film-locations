/**
 * Delete Location Button
 * Client component for deleting locations with confirmation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  locationId: string;
  locationName: string;
  variant?: 'link' | 'button';
}

export default function DeleteButton({ locationId, locationName, variant = 'link' }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${locationName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete location');
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location. Please try again.');
      setIsDeleting(false);
    }
  };

  const baseClasses = "disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = variant === 'button'
    ? "w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-bold uppercase"
    : "text-red-600 hover:text-red-900";

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`${baseClasses} ${variantClasses}`}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
