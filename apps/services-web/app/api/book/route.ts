import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, vehicle, registration, preferredDate, notes } = body;

    if (!name || !email || !phone || !service || !vehicle) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const resendClient = getResendClient();

    if (!resendClient) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please call us directly.' },
        { status: 503 }
      );
    }

    const { error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO || 'your-email@example.com',
      replyTo: email,
      subject: `[Services] Booking Request: ${service} — ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #D4AF37;">Car Nation Services</h1>
            <p style="margin: 4px 0 0;">New Booking Request</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Vehicle:</strong> ${vehicle}</p>
            ${registration ? `<p><strong>Registration:</strong> ${registration}</p>` : ''}
            ${preferredDate ? `<p><strong>Preferred Date:</strong> ${preferredDate}</p>` : ''}
            ${notes ? `<p><strong>Notes:</strong></p><p style="background: #fff; padding: 12px; border-left: 3px solid #D4AF37; border-radius: 4px;">${notes.replace(/\n/g, '<br>')}</p>` : ''}
          </div>
        </div>
      `,
      text: `Booking Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nVehicle: ${vehicle}\nRegistration: ${registration || 'N/A'}\nPreferred Date: ${preferredDate || 'N/A'}\nNotes: ${notes || 'None'}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Booking form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
