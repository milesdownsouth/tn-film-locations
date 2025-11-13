/**
 * Contact Page - Matches Design Exactly
 */

'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [formLoadTime] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Client-side spam checks
    if (honeypot) {
      // Bot filled the honeypot field
      setError('Invalid submission. Please try again.');
      setLoading(false);
      return;
    }

    const timeSinceLoad = Date.now() - formLoadTime;
    if (timeSinceLoad < 3000) {
      // Form submitted too quickly (less than 3 seconds)
      setError('Please take a moment to review your message before submitting.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _honeypot: honeypot,
          _timestamp: formLoadTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact form');
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit contact form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">LET'S CONNECT</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Whether you're scouting for your next production, need help finding the perfect venue,
            or have questions about our services, we're here to help. Fill out the form below and
            we'll get back to you within 24 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#C41E3A] text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
            <p>We've received your message and will get back to you within 24 hours.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users, catches bots */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
              />
            </div>

            {/* Phone and Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="tel"
                placeholder="Phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
              />
              <input
                type="text"
                placeholder="Company/Production"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-6 py-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
              />
            </div>

            {/* Message Textarea */}
            <textarea
              placeholder="Tell us about your project and what you're looking for..."
              required
              rows={8}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-6 py-4 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C41E3A]"
            />

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C41E3A] text-white px-12 py-4 rounded hover:bg-[#a01729] transition-colors font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SENDING...' : 'GET STARTED'}
              </button>
            </div>
          </form>
          </>
        )}
      </div>
    </section>
  );
}
