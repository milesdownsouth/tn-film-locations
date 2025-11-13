/**
 * Individual Location Detail Page - To be implemented
 * Features: Photo gallery (up to 50 images), location details, download options
 */

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Location Details</h1>
      <p className="text-gray-600">Location ID: {params.id}</p>
      <p className="text-gray-600">Full location page coming soon...</p>
    </div>
  );
}
