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
}

export default function DeleteButton({ locationId, locationName }: DeleteButtonProps) {
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

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
