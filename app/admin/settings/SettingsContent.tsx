/**
 * Admin Settings Content
 * Client component for managing site settings
 */

'use client';

import { useState, useEffect } from 'react';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
}

export default function SettingsContent() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);

        // Find contact email setting
        const contactSetting = data.settings.find(
          (s: Setting) => s.setting_key === 'contact_email'
        );
        if (contactSetting) {
          setContactEmail(contactSetting.setting_value);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactEmail = async () => {
    setSaving(true);
    setSuccessMessage('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: 'contact_email',
          setting_value: contactEmail,
        }),
      });

      if (response.ok) {
        setSuccessMessage('Contact email updated successfully!');
        fetchSettings();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to update contact email');
      }
    } catch (error) {
      console.error('Error updating contact email:', error);
      alert('Failed to update contact email');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-black mb-8">Site Settings</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C41E3A]"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Contact Email Setting */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Contact Form Notifications</h2>
              <p className="text-gray-600 mb-6">
                Configure where contact form submissions are sent. This email will receive notifications
                whenever someone submits the contact form on your website.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="admin@tnfilmlocations.com"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    All contact form submissions will be sent to this email address.
                  </p>
                </div>

                <button
                  onClick={saveContactEmail}
                  disabled={saving || !contactEmail}
                  className="bg-[#C41E3A] text-white px-8 py-3 rounded hover:bg-[#a01729] transition-colors font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                    {successMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Email Configuration Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Email Configuration</h3>
              <p className="text-blue-800 mb-4">
                To enable email notifications, you need to configure Resend in your environment variables.
              </p>
              <div className="bg-white rounded p-4 font-mono text-sm">
                <p className="text-gray-700 mb-2">Add to your .env.local file:</p>
                <code className="text-[#C41E3A]">RESEND_API_KEY=your_resend_api_key_here</code>
              </div>
              <p className="text-blue-800 mt-4 text-sm">
                Get your API key from: <a href="https://resend.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">resend.com/api-keys</a>
              </p>
            </div>

            {/* Domain Configuration Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-2">Email Domain Configuration</h3>
              <p className="text-yellow-800 mb-4">
                For production use, you should verify your domain with Resend to send emails from your own domain
                (e.g., noreply@tnfilmlocations.com).
              </p>
              <p className="text-yellow-800 text-sm">
                Learn more: <a href="https://resend.com/docs/dashboard/domains/introduction" target="_blank" rel="noopener noreferrer" className="underline font-medium">resend.com/docs/dashboard/domains</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
