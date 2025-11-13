/**
 * About Page
 */

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About TN Film Locations</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Your premier resource for discovering film locations across Tennessee.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          We connect filmmakers, location scouts, and production companies with
          Tennessee's most diverse and film-ready locations. From historic mansions
          to modern urban settings, we make location scouting easier and more
          efficient.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Comprehensive database of 100+ premium locations</li>
          <li>Up to 50 high-quality photos per location</li>
          <li>Detailed property information and amenities</li>
          <li>Advanced search and filtering capabilities</li>
          <li>Direct contact with property owners</li>
          <li>Downloadable location packages (ZIP and PDF)</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">Why Tennessee?</h2>
        <p className="text-gray-700 mb-4">
          Tennessee offers diverse landscapes, from the Smoky Mountains to vibrant
          cities like Nashville and Memphis. Our state provides competitive
          incentives for film production and a welcoming community for filmmakers.
        </p>
      </div>
    </div>
  );
}
