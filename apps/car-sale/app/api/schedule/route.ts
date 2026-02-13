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
    const { name, email, phone, appointmentType, date, time, carDetails, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !appointmentType || !date || !time) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
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

    // Format the date for better readability
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Send email using Resend
    const { data, error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO || 'your-email@example.com',
      replyTo: email,
      subject: `New ${appointmentType} Request - ${carDetails || 'Vehicle Inquiry'}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #000 0%, #1a1a1a 100%); color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; color: #10b981; font-size: 28px; }
              .header p { margin: 10px 0 0 0; color: #d1d5db; }
              .badge { display: inline-block; background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-top: 10px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .appointment-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
              .appointment-box h2 { margin: 0 0 10px 0; font-size: 24px; }
              .appointment-box p { margin: 5px 0; font-size: 18px; }
              .field { margin-bottom: 20px; }
              .field-label { font-weight: bold; color: #666; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; }
              .field-value { background: white; padding: 12px; border-radius: 4px; border-left: 4px solid #10b981; }
              .car-details { background: #1f2937; color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd; }
              .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚗 CAR NATION</h1>
                <p>New Appointment Request</p>
                <span class="badge">${appointmentType}</span>
              </div>
              
              <div class="content">
                <div class="appointment-box">
                  <h2>📅 Scheduled For</h2>
                  <p><strong>${formattedDate}</strong></p>
                  <p>🕐 ${time}</p>
                </div>

                ${carDetails ? `
                  <div class="car-details">
                    <strong>🚗 Vehicle of Interest:</strong><br>
                    ${carDetails}
                  </div>
                ` : ''}
                
                <div class="field">
                  <div class="field-label">Customer Name:</div>
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
                
                ${message ? `
                  <div class="field">
                    <div class="field-label">Additional Notes:</div>
                    <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                ` : ''}

                <div style="text-align: center; margin-top: 30px;">
                  <a href="tel:${phone}" class="cta-button">📞 Call Customer</a>
                  <a href="mailto:${email}" class="cta-button" style="background: #3b82f6; margin-left: 10px;">✉️ Email Customer</a>
                </div>
              </div>
              
              <div class="footer">
                <p><strong>⏰ Action Required:</strong> Please confirm this appointment with the customer as soon as possible.</p>
                <p style="margin-top: 10px;">This email was sent from the Car Nation appointment booking system</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New ${appointmentType} Request

APPOINTMENT DETAILS:
Date: ${formattedDate}
Time: ${time}

${carDetails ? `VEHICLE:
${carDetails}\n` : ''}

CUSTOMER INFORMATION:
Name: ${name}
Email: ${email}
Phone: ${phone}

${message ? `ADDITIONAL NOTES:
${message}\n` : ''}

Please confirm this appointment with the customer as soon as possible.
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
    console.error('Schedule appointment error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
