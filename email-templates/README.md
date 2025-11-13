# TN Film Locations - Email Templates

Branded email templates for Supabase authentication emails.

## Templates Included

1. **confirmation.html** - Email verification for new signups
2. **recovery.html** - Password reset email
3. **magic-link.html** - Passwordless login link
4. **email-change.html** - Confirm email address change

## Brand Guidelines

All templates follow TN Film Locations brand:
- **Primary Color**: #C41E3A (Red)
- **Secondary Color**: #000000 (Black)
- **Typography**: Anton for headings, Open Sans for body
- **Tone**: Professional, welcoming, on-brand

## How to Set Up in Supabase

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Update Each Template

For each email type (Confirm signup, Reset password, Magic Link, Change email):

1. Click on the email template you want to update
2. Replace the default template with the corresponding HTML from this folder
3. Make sure to keep the Supabase variables (they're already in the templates):
   - `{{ .ConfirmationURL }}` - The confirmation/action link
   - `{{ .Token }}` - The token (if needed)
   - `{{ .SiteURL }}` - Your site URL

### Step 3: Template Mapping

| Supabase Template | File to Use |
|------------------|-------------|
| **Confirm signup** | confirmation.html |
| **Reset password** | recovery.html |
| **Magic Link** | magic-link.html |
| **Change Email Address** | email-change.html |

### Step 4: Configure Email Settings

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Configure:
   - **Site URL**: Your production URL (e.g., https://tnfilmlocations.com)
   - **Redirect URLs**: Add your auth callback URLs
   - **Email Rate Limit**: Set appropriate limits

### Step 5: Sender Configuration

Update the email sender details:
- **Sender Name**: TN Film Locations
- **Sender Email**: Use a branded email (e.g., noreply@tnfilmlocations.com)

### Step 6: Test the Emails

1. Create a test account with a temporary email
2. Test password reset flow
3. Verify all links work correctly
4. Check email appearance in different clients (Gmail, Outlook, Apple Mail)

## Email Variables Available

Supabase provides these variables you can use:

- `{{ .ConfirmationURL }}` - Complete URL with token for confirmation
- `{{ .Token }}` - Just the token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your configured site URL
- `{{ .Email }}` - User's email address

## Customization

To further customize:

1. Add your logo: Upload logo to a CDN and replace the text header with:
   ```html
   <img src="YOUR_LOGO_URL" alt="TN Film Locations" style="max-width: 200px; height: auto;">
   ```

2. Adjust colors in the style attributes if brand colors change

3. Add additional content/sections as needed

## Best Practices

- Keep subject lines clear and branded
- Test on mobile devices
- Ensure links are prominent and easy to click
- Include text version as fallback
- Test in spam filters

## Support

If emails aren't sending:
1. Check Supabase email logs in Dashboard → Authentication → Logs
2. Verify DNS settings for custom domain emails
3. Check rate limits
4. Ensure Supabase email service is enabled

## Notes

- These templates use inline CSS for maximum email client compatibility
- Responsive design works on mobile and desktop
- Color scheme matches your website branding
- Professional tone consistent with brand voice
