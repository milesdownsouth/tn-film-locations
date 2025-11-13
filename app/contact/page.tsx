/**
 * Contact Page
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>info@tnfilmlocations.com</p>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>(555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-semibold">Office</h3>
              <p>
                123 Music Row
                <br />
                Nashville, TN 37203
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM CST</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              Thank you for your message! We'll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                label="Subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
