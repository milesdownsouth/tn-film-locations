/**
 * Contact Form API
 * Handles contact form submissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Resend } from 'resend';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Use service role key for public contact form submissions
    // This bypasses RLS and is the recommended approach for public forms
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() { return []; },
          setAll() {},
        },
      }
    );

    const body = await request.json();

    // SPAM PROTECTION: Check honeypot
    if (body._honeypot && body._honeypot !== '') {
      console.log('Spam detected: Honeypot filled');
      return NextResponse.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // SPAM PROTECTION: Check timestamp (minimum 3 seconds)
    if (body._timestamp) {
      const timeSinceLoad = Date.now() - body._timestamp;
      if (timeSinceLoad < 3000) {
        console.log('Spam detected: Form submitted too quickly');
        return NextResponse.json(
          { error: 'Please take a moment to review your message' },
          { status: 400 }
        );
      }
    }

    // SPAM PROTECTION: Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(clientIp, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3, // Max 3 submissions per 15 minutes
    });

    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${resetIn} minutes.` },
        { status: 429 }
      );
    }

    // Validate required fields
    const { name, email, phone, company, message } = body;

    if (!name || !email || !phone || !company || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Sanitize inputs (trim whitespace)
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      message: message.trim(),
    };

    // Insert into database
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([sanitizedData])
      .select()
      .single();

    if (error) {
      console.error('Error inserting contact submission:', error);
      return NextResponse.json(
        { error: 'Failed to submit contact form' },
        { status: 500 }
      );
    }

    // Send email notification (don't fail if this fails)
    try {
      // Fetch contact email from settings
      const { data: settingData } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'contact_email')
        .single();

      const recipientEmail = settingData?.setting_value || 'admin@tnfilmlocations.com';

      // Send email if Resend API key is configured
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: 'TN Film Locations <onboarding@resend.dev>',
          to: recipientEmail,
          subject: `New Contact Form Submission from ${sanitizedData.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #C41E3A;">New Contact Form Submission</h2>
              <p>You have received a new contact form submission from your TN Film Locations website.</p>

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${sanitizedData.name}</p>
                <p><strong>Email:</strong> ${sanitizedData.email}</p>
                <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
                <p><strong>Company/Production:</strong> ${sanitizedData.company}</p>
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
              </div>

              <p style="color: #666; font-size: 14px;">
                This email was sent from your TN Film Locations contact form.
                <br>
                Submitted on: ${new Date().toLocaleString()}
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending email notification:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
