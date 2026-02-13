# Email & WhatsApp Configuration Guide

This guide will help you set up the contact form email functionality and WhatsApp integration.

## 📧 Email Setup (Using Resend)

### Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day on free tier)
3. Verify your email address

### Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Click on "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a name (e.g., "Car Nation Contact Form")
5. Copy the API key (starts with `re_`)

### Step 3: Add Domain (Optional but Recommended)

For production use, you should add your own domain:

1. In Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `apexmotors.com`)
4. Follow the DNS verification steps
5. Once verified, you can send from `noreply@yourdomain.com`

**Note:** For testing, you can use the default `onboarding@resend.dev` sender.

### Step 4: Configure Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your values:

```env
# Resend API Key (Get from https://resend.com/api-keys)
RESEND_API_KEY=re_your_actual_api_key_here

# Email FROM address (use your verified domain or onboarding@resend.dev for testing)
EMAIL_FROM=Car Nation <noreply@yourdomain.com>

# Where contact form submissions should be sent
EMAIL_TO=youremail@example.com

# WhatsApp Business Number (format: country code + number, no + or spaces)
NEXT_PUBLIC_WHATSAPP_NUMBER=447123456789
```

### Step 5: Restart Development Server

```bash
npm run dev
```

## 📱 WhatsApp Setup

### Get Your WhatsApp Business Number

1. **Format:** Country code + number (no + or spaces)
   - UK Example: `447123456789` (for +44 7123 456789)
   - US Example: `14155551234` (for +1 415 555 1234)

2. **Update the environment variable:**
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=your_whatsapp_number
   ```

3. **For WhatsApp Business:**
   - Use your WhatsApp Business number
   - Enable "Quick Replies" for faster responses
   - Set up away messages for after-hours

## 🚀 Deployment Setup (Netlify/Vercel)

### Environment Variables in Production

Add these environment variables to your hosting platform:

**For Netlify:**
1. Go to Site settings → Environment variables
2. Add each variable:
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `EMAIL_TO`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable for Production, Preview, and Development

## ✅ Testing

### Test the Contact Form

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/contact`
3. Fill out the contact form
4. Submit and check your email

### Test WhatsApp Links

1. Click "OPEN WHATSAPP" button
2. Should open WhatsApp Web/App with your number
3. Test the "SEND VIA WHATSAPP" button with form data

## 🔒 Security Notes

- **Never commit `.env.local`** to git (it's in `.gitignore`)
- Keep your `RESEND_API_KEY` secret
- Rotate API keys if they're exposed
- Use environment variables for all sensitive data

## 📊 Monitoring

### Check Email Delivery

1. Log in to Resend dashboard
2. Go to "Emails" to see delivery status
3. Check for bounces or failed deliveries

### Email Limits

- **Free tier:** 100 emails/day, 3,000/month
- **Paid plans:** Start at $20/month for 50,000 emails

## 🆘 Troubleshooting

### "Failed to send email" error

1. Check your `RESEND_API_KEY` is correct
2. Verify you haven't exceeded your daily limit
3. Check Resend dashboard for errors

### WhatsApp link not working

1. Verify `NEXT_PUBLIC_WHATSAPP_NUMBER` format (no + or spaces)
2. Make sure you've restarted the dev server after changing env vars
3. Test with `https://wa.me/your_number` directly in browser

### Emails not arriving

1. Check spam/junk folder
2. Verify `EMAIL_TO` address is correct
3. Check Resend dashboard for delivery status
4. For custom domains, verify DNS records are set up correctly

## 🎨 Customization

### Email Template

Edit the email HTML in `/app/api/contact/route.ts` to match your branding.

### Form Fields

Add or remove fields in `/app/contact/page.tsx` and update the API route accordingly.

## 📝 Alternative Email Services

If you prefer a different service, you can replace Resend with:

- **SendGrid** - Popular, generous free tier
- **Mailgun** - Good for high volume
- **AWS SES** - Cost-effective for large scale
- **Postmark** - Great deliverability

Just update the `/app/api/contact/route.ts` file with your chosen service's SDK.
