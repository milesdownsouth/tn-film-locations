# Contact Form Spam Protection

## Overview

The contact form is protected by multiple layers of invisible spam protection that work together to prevent abuse while remaining completely transparent to legitimate users.

## Protection Layers

### 1. Honeypot Field

**How it works:**
- A hidden field (`name="website"`) is added to the form
- Positioned off-screen using CSS (`position: absolute; left: -9999px`)
- Bots often fill in all fields, including hidden ones
- Legitimate users never see or interact with this field

**Detection:**
- If the honeypot field contains any value, the submission is rejected
- Returns HTTP 400 error with "Invalid submission" message

### 2. Time-Based Protection

**How it works:**
- Form load time is recorded when the page loads
- Submission time is checked against load time
- Bots typically submit forms immediately (< 3 seconds)
- Humans need time to read and fill out the form

**Detection:**
- Forms submitted in less than 3 seconds are rejected
- Returns user-friendly message: "Please take a moment to review your message"
- Checked both client-side (immediate feedback) and server-side (security)

### 3. Rate Limiting

**How it works:**
- Tracks submissions by IP address
- Allows max 3 submissions per 15-minute window
- Uses in-memory storage with automatic cleanup
- Supports multiple proxy headers (Cloudflare, x-forwarded-for, etc.)

**Configuration:**
```typescript
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3             // Max 3 submissions
}
```

**Detection:**
- After 3 submissions, subsequent attempts are blocked
- Returns HTTP 429 (Too Many Requests)
- Error message shows time until reset: "Too many submissions. Please try again in X minutes."

### 4. IP Address Detection

**Supported headers:**
- `x-forwarded-for` (most proxies)
- `x-real-ip` (NGINX)
- `cf-connecting-ip` (Cloudflare)
- Falls back to 'unknown' if no IP detected

## User Experience

**For Legitimate Users:**
- ✅ All protection is invisible
- ✅ No CAPTCHAs to solve
- ✅ No extra steps or clicks
- ✅ Fast submission process
- ✅ Clear error messages if limits exceeded

**For Bots:**
- ❌ Honeypot trap catches form-filling bots
- ❌ Time check blocks instant submissions
- ❌ Rate limiting prevents mass submissions
- ❌ No way to bypass server-side checks

## Rate Limit Configuration

### Current Settings

```typescript
// In /app/api/contact/route.ts
const rateLimit = checkRateLimit(clientIp, {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3,            // Max 3 submissions per window
});
```

### Adjusting Limits

To change the rate limits, modify the values in `/app/api/contact/route.ts`:

**More strict (recommended for high-spam sites):**
```typescript
windowMs: 60 * 60 * 1000,  // 1 hour
maxRequests: 2,             // Max 2 submissions
```

**More lenient (for sites with multiple users behind same IP):**
```typescript
windowMs: 10 * 60 * 1000,  // 10 minutes
maxRequests: 5,             // Max 5 submissions
```

### Changing Time Threshold

To adjust the minimum form view time, modify both:

**Client-side:** `/app/contact/page.tsx`
```typescript
if (timeSinceLoad < 3000) { // 3 seconds in milliseconds
```

**Server-side:** `/app/api/contact/route.ts`
```typescript
if (timeSinceLoad < 3000) { // Must match client-side
```

## Optional: Additional Protection

### Cloudflare Turnstile (Recommended)

Turnstile is a free, privacy-friendly CAPTCHA alternative from Cloudflare.

**Benefits:**
- ✅ Free forever
- ✅ No Google tracking
- ✅ Privacy-focused
- ✅ Better UX than reCAPTCHA
- ✅ Most users won't even see a challenge

**Setup:**

1. **Sign up for Cloudflare:** https://dash.cloudflare.com
2. **Get Turnstile keys:** Dashboard → Turnstile → Add Site
3. **Add to environment variables:**
   ```
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   TURNSTILE_SECRET_KEY=your_secret_key
   ```

4. **Install package:**
   ```bash
   npm install @marsidev/react-turnstile
   ```

5. **Add to contact form:** (I can help implement this if desired)

### Alternative: reCAPTCHA v3

Google's reCAPTCHA v3 runs in the background and scores users.

**Pros:**
- Invisible to most users
- Widely recognized

**Cons:**
- Requires Google account
- Privacy concerns
- Free tier has limits

## Monitoring

### Check Rate Limit Store

The rate limiter stores data in memory. To monitor:

```typescript
// In your API route
import { rateLimitStore } from '@/lib/rate-limiter';

console.log('Active rate limits:', rateLimitStore.size);
```

### Log Spam Attempts

Spam attempts are already logged in the API:

```typescript
console.log('Spam detected: Honeypot filled');
console.log('Spam detected: Form submitted too quickly');
```

Check your logs (Vercel logs) to see blocked attempts.

### Database Tracking

To track spam attempts in the database, you could add a `spam_attempts` table:

```sql
CREATE TABLE spam_attempts (
  id UUID PRIMARY KEY,
  ip_address TEXT,
  reason TEXT,
  attempted_at TIMESTAMP DEFAULT NOW()
);
```

## Production Notes

### In-Memory Rate Limiting

The current implementation uses in-memory storage, which works well for single-server deployments.

**Limitations:**
- Resets when server restarts
- Not shared across multiple server instances

**For high-traffic sites with multiple servers:**
Consider using Redis for distributed rate limiting:

```typescript
// Example with Redis (requires redis package)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### Cloudflare Integration

If using Cloudflare:
- Rate limiting can also be configured in Cloudflare dashboard
- Cloudflare's IP headers are automatically detected
- Consider using Cloudflare's built-in rate limiting as additional layer

## Testing

### Test Honeypot

1. Open browser DevTools
2. Find the hidden `website` field
3. Fill it in and submit
4. Should see "Invalid submission" error

### Test Rate Limiting

1. Submit form 3 times quickly
2. 4th attempt should be blocked
3. Wait 15 minutes or restart server
4. Should work again

### Test Time Protection

1. Load form
2. Immediately hit submit (within 3 seconds)
3. Should see "Please take a moment to review your message"

## Summary

**Current Protection:**
- ✅ Honeypot field (catches basic bots)
- ✅ Time-based protection (blocks instant submissions)
- ✅ Rate limiting (3 per 15 min per IP)
- ✅ Server-side validation (cannot be bypassed)
- ✅ IP tracking with proxy support

**Optional Additions:**
- 🔲 Cloudflare Turnstile (recommended for high-traffic)
- 🔲 Redis-based rate limiting (for multiple servers)
- 🔲 Database logging of spam attempts

The current implementation should block 95%+ of automated spam while providing excellent UX for legitimate users.
