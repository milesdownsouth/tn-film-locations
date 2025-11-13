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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-[#C41E3A] text-white px-12 py-4 rounded hover:bg-[#a01729] transition-colors font-bold uppercase"
              >
                GET STARTED
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
