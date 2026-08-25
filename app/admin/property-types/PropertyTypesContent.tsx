'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PropertyType {
  id: string;
  name: string;
  display_name: string;
  created_at: string;
}

export default function PropertyTypesContent() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPropertyTypes = async () => {
    try {
      const response = await fetch('/api/admin/property-types');
      const data = await response.json();
      if (response.ok) {
        setPropertyTypes(data.propertyTypes);
      } else {
        setError(data.error || 'Failed to fetch property types');
      }
    } catch {
      setError('Failed to fetch property types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) return;

    setAdding(true);
    setError(null);

    try {
      const name = newDisplayName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const response = await fetch('/api/admin/property-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, display_name: newDisplayName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewDisplayName('');
        fetchPropertyTypes();
      } else {
        setError(data.error || 'Failed to add property type');
      }
    } catch {
      setError('Failed to add property type');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editDisplayName.trim()) return;

    setError(null);

    try {
      const response = await fetch(`/api/admin/property-types/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_name: editDisplayName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setEditingId(null);
        setEditDisplayName('');
        fetchPropertyTypes();
      } else {
        setError(data.error || 'Failed to update property type');
      }
    } catch {
      setError('Failed to update property type');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/admin/property-types/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPropertyTypes();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete property type');
      }
    } catch {
      setError('Failed to delete property type');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="text-[#C41E3A] hover:text-[#a01729] mb-4 inline-block">
            &larr; Back to Admin
          </Link>
          <h1 className="text-4xl font-semibold text-black">Property Types</h1>
          <p className="text-gray-600 mt-2">
            Add, edit, or remove property types that are available when creating locations.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-lg">&#9888;</span>
                <p className="text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                &#10005;
              </button>
            </div>
          </div>
        )}

        {/* Add New Property Type */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-black mb-4">Add New Property Type</h2>
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="e.g. Church, Restaurant, Barn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
            />
            <button
              type="submit"
              disabled={adding || !newDisplayName.trim()}
              className="px-6 py-2 bg-[#C41E3A] text-white rounded hover:bg-[#a01729] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>

        {/* Property Types List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-black">
              Current Property Types ({propertyTypes.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading property types...</div>
          ) : propertyTypes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No property types found. Add one above to get started.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {propertyTypes.map((pt) => (
                <li key={pt.id} className="px-6 py-4 flex items-center justify-between">
                  {editingId === pt.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(pt.id);
                          if (e.key === 'Escape') { setEditingId(null); setEditDisplayName(''); }
                        }}
                      />
                      <button
                        onClick={() => handleUpdate(pt.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditDisplayName(''); }}
                        className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-black font-medium">{pt.display_name}</span>
                        <span className="text-gray-400 text-sm ml-2">({pt.name})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditingId(pt.id); setEditDisplayName(pt.display_name); }}
                          className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${pt.display_name}"? This won't affect existing locations that already use this type.`)) {
                              handleDelete(pt.id);
                            }
                          }}
                          disabled={deletingId === pt.id}
                          className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded text-sm font-medium disabled:opacity-50"
                        >
                          {deletingId === pt.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
