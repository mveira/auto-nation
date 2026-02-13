import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
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
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
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

    // Get Resend client
    const resendClient = getResendClient();
    
    if (!resendClient) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact us via WhatsApp.' },
        { status: 503 }
      );
    }

    // Send email using Resend
    const { data, error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO || 'your-email@example.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #000; color: #fff; padding: 20px; text-align: center; }
              .header h1 { margin: 0; color: #10b981; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px; }
              .field { margin-bottom: 20px; }
              .field-label { font-weight: bold; color: #666; margin-bottom: 5px; }
              .field-value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #10b981; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚗 CAR NATION</h1>
                <p>New Contact Form Submission</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="field-label">Name:</div>
                  <div class="field-value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">Email:</div>
                  <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                
                <div class="field">
                  <div class="field-label">Phone:</div>
                  <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                
                <div class="field">
                  <div class="field-label">Message:</div>
                  <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the Car Nation contact form</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
