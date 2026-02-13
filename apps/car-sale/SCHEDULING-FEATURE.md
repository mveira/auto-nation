# Test Drive & Viewing Scheduling Feature

This document explains the scheduling system for test drives and viewings.

## Overview

Users can now schedule test drives or viewings for vehicles through your website. When a user submits a scheduling request, the business owner receives an email with all the details.

## Features

### 1. **Car Detail Page Integration** (`/cars/[id]`)
- Added "SCHEDULE TEST DRIVE" button as the primary CTA
- Button includes car details in the scheduling form
- Also available in mobile sticky footer

### 2. **Quick Schedule Page** (`/schedule`)
- Simpler, single-page form
- Pre-fills car information when coming from a car detail page
- Date and time selection
- Choice between "Test Drive" or "Viewing"
- Optional notes field

### 3. **Multi-Step Booking Page** (`/book`)
- Existing page now fully functional with email notifications
- Step 1: Select vehicle and appointment type
- Step 2: Choose date and time
- Step 3: Enter contact details
- Visual progress indicator

### 4. **Email Notifications**
When a user schedules an appointment, the business owner receives a beautifully formatted email with:
- Appointment type (Test Drive or Viewing)
- Date and time
- Customer contact information
- Vehicle details
- Additional notes (if provided)
- Quick action buttons to call or email the customer

## Setup Instructions

### Environment Variables

Make sure you have these variables in your `.env.local` file:

```env
# Required for sending emails
RESEND_API_KEY=re_your_api_key_here

# Email configuration
EMAIL_FROM=Car Nation <noreply@yourdomain.com>
EMAIL_TO=your-email@example.com

# WhatsApp (optional fallback)
NEXT_PUBLIC_WHATSAPP_NUMBER=447123456789
```

### Getting a Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to "API Keys" in the dashboard
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### Email Setup

**Important**: For production, you'll need to verify your domain with Resend:

1. In your Resend dashboard, go to "Domains"
2. Click "Add Domain" and follow the instructions
3. Update `EMAIL_FROM` to use your verified domain:
   ```env
   EMAIL_FROM=Car Nation <bookings@yourdomain.com>
   ```

For testing, you can use `onboarding@resend.dev` as the sender.

## User Journey

### From Car Detail Page:
1. User browses inventory and finds a car they like
2. User clicks "SCHEDULE TEST DRIVE" button
3. Redirected to `/schedule` with car info pre-filled
4. User selects date, time, and appointment type
5. User enters contact details
6. Submission sends email to business owner
7. User sees confirmation message

### From Navigation:
1. User clicks "BOOK" in the navigation
2. Multi-step wizard opens
3. User selects vehicle from inventory
4. User chooses date and time slot
5. User enters contact details
6. Submission sends email to business owner
7. User sees confirmation message

## API Endpoint

**POST** `/api/schedule`

### Request Body:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "07123456789",
  "appointmentType": "Test Drive",
  "date": "2024-02-15",
  "time": "14:00",
  "carDetails": "2023 BMW M4",
  "message": "Optional additional notes"
}
```

### Response:
```json
{
  "success": true,
  "messageId": "email-id-from-resend"
}
```

## Error Handling

- If the email service is not configured, users see a friendly error message
- Users can always fall back to WhatsApp contact
- Form validation ensures all required fields are filled
- Date picker prevents selecting past dates
- Email validation ensures proper format

## Testing

### Local Testing:
1. Set up your `.env.local` with Resend API key
2. Run `npm run dev`
3. Navigate to any car detail page
4. Click "SCHEDULE TEST DRIVE"
5. Fill out the form and submit
6. Check the email inbox configured in `EMAIL_TO`

### Production Testing:
1. Deploy to Netlify/Vercel with environment variables configured
2. Verify domain with Resend
3. Test the full booking flow
4. Confirm emails are being received

## Customization

### Modify Email Template:
Edit the email HTML in `/app/api/schedule/route.ts` (lines 48-175)

### Change Time Slots:
Edit the time options in `/app/book/page.tsx` (lines 40-43)

### Modify Form Fields:
Add or remove fields in:
- `/app/schedule/page.tsx` (simple form)
- `/app/book/page.tsx` (multi-step form)

### Styling:
All components use Tailwind CSS and follow the existing design system. Adjust classes as needed to match your brand.

## Mobile Experience

- Fully responsive design
- Native date/time pickers work great on mobile devices
- Sticky mobile CTA on car detail pages
- Touch-friendly buttons and inputs

## Future Enhancements

Consider adding:
- SMS confirmations (using Twilio)
- Calendar integration (Google Calendar, iCal)
- Availability checking (to prevent double-booking)
- Automated reminder emails
- Customer portal to manage bookings
- Admin dashboard to view/manage all appointments

## Support

If users encounter issues:
1. Check environment variables are correctly set
2. Verify Resend API key is valid
3. Check email addresses are correct
4. Review server logs for errors
5. Test with WhatsApp fallback option

## Files Modified/Created

### New Files:
- `/app/api/schedule/route.ts` - API endpoint for scheduling
- `/app/schedule/page.tsx` - Simple scheduling form page
- `SCHEDULING-FEATURE.md` - This documentation

### Modified Files:
- `/app/cars/[id]/page.tsx` - Added schedule buttons
- `/app/book/page.tsx` - Connected to API endpoint

## Compliance

Remember to:
- Add scheduling to your privacy policy
- Ensure GDPR compliance for customer data
- Secure email addresses and phone numbers
- Consider data retention policies
- Add terms and conditions for bookings
