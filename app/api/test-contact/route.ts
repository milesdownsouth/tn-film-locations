/**
 * Test Contact Form Endpoint
 * Helps diagnose contact form issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  try {
    // Use service role key to test contact form functionality
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
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    };

    // Check 1: Can we connect to Supabase?
    try {
      const { data, error } = await supabase.from('locations').select('id').limit(1);
      results.checks.supabaseConnection = error ? `Error: ${error.message}` : 'OK';
    } catch (e) {
      results.checks.supabaseConnection = `Exception: ${e}`;
    }

    // Check 2: Does contact_submissions table exist?
    try {
      const { data, error } = await supabase.from('contact_submissions').select('id').limit(1);
      results.checks.contactSubmissionsTable = error ? `Error: ${error.message}` : 'OK';
    } catch (e) {
      results.checks.contactSubmissionsTable = `Exception: ${e}`;
    }

    // Check 3: Does admin_settings table exist?
    try {
      const { data, error } = await supabase.from('admin_settings').select('setting_key').limit(1);
      results.checks.adminSettingsTable = error ? `Error: ${error.message}` : 'OK';
    } catch (e) {
      results.checks.adminSettingsTable = `Exception: ${e}`;
    }

    // Check 4: Can we insert into contact_submissions?
    try {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-0000',
        company: 'Test Company',
        message: 'This is a test message - will be deleted'
      };

      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([testData])
        .select()
        .single();

      if (error) {
        results.checks.insertTest = `Error: ${error.message}`;
      } else {
        results.checks.insertTest = 'OK';
        // Clean up test record
        if (data) {
          await supabase.from('contact_submissions').delete().eq('id', data.id);
        }
      }
    } catch (e) {
      results.checks.insertTest = `Exception: ${e}`;
    }

    // Check 5: Is Resend API key configured?
    results.checks.resendApiKey = process.env.RESEND_API_KEY ? 'Configured' : 'Not configured';

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Diagnostic test failed',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
