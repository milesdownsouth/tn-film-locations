/**
 * Logout Button Component
 * Client-side logout functionality
 */

'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}
