import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';
import { normalizeVrm, type MotSummary } from '@/lib/dvsa';
import { createLeadFromEnquiry } from '@/lib/intake';
import { processOutbox } from '@/lib/outbox';

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
    const { name, email, phone, vrm, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!vrm) {
      return NextResponse.json({ error: 'Vehicle registration (VRM) is required' }, { status: 400 });
    }

    const normalizedVrm = normalizeVrm(vrm);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // ── DB write (Lead + MotReport + OutboxEvent) — DVSA enrichment inside ──
    let leadId: string | null = null;
    let motSummary: MotSummary | null = null;
    try {
      const result = await createLeadFromEnquiry({
        name, email, phone,
        vrm,
        message,
      });
      leadId = result.leadId;
      motSummary = result.motSummary;
    } catch (err) {
      // DB write failed — log but continue to send email (fallback)
      console.error('[contact] Intake DB write failed:', err);
    }

    // ── Fire-and-forget outbox processing (triggers GHL sync) ──
    if (leadId) {
      processOutbox().catch((err) => console.error('[contact] Outbox processing error:', err));
    }

    // ── GHL webhook (legacy — kept as fallback until outbox is confirmed working) ──
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_CONTACT_URL;
    if (ghlWebhookUrl) {
      fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'services-web',
          type: 'enquiry',
          page: '/contact',
          submittedAt: new Date().toISOString(),
          contact: { name, email, phone },
          vrm: normalizedVrm,
          message,
          mot: motSummary ?? undefined,
        }),
      }).catch((err) => console.error('GHL contact webhook error:', err));
    }

    // ── Send email via Resend ──
    const resendClient = getResendClient();

    if (!resendClient) {
      console.error('Resend API key not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please call us directly.' },
        { status: 503 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeVrm = escapeHtml(normalizedVrm);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Build MOT summary HTML block (garage-only — user never sees this)
    const motHtml = motSummary
      ? `
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <h3 style="color: #D4AF37; margin: 0 0 8px;">MOT Summary (DVSA)</h3>
            <p><strong>Status:</strong> ${escapeHtml(motSummary.status)}</p>
            ${motSummary.expiryDate ? `<p><strong>Expiry:</strong> ${escapeHtml(motSummary.expiryDate)}</p>` : ''}
            ${motSummary.lastTestDate ? `<p><strong>Last Test:</strong> ${escapeHtml(motSummary.lastTestDate)}</p>` : ''}
            ${motSummary.odometerAtLastTest != null ? `<p><strong>Odometer:</strong> ${motSummary.odometerAtLastTest.toLocaleString()} mi</p>` : ''}
            <p><strong>Advisories:</strong> ${motSummary.advisoryCount} &nbsp; <strong>Major:</strong> ${motSummary.majorCount} &nbsp; <strong>Dangerous:</strong> ${motSummary.dangerousCount}</p>
            ${motSummary.flags.length > 0 ? `<p style="background: #fff3cd; padding: 8px 12px; border-left: 3px solid #ffc107; border-radius: 4px; font-weight: bold;">${motSummary.flags.map(escapeHtml).join(' | ')}</p>` : ''}`
      : `
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <p style="color: #999;"><em>MOT data unavailable (DVSA lookup skipped or failed)</em></p>`;

    const motText = motSummary
      ? `\n\n--- MOT Summary (DVSA) ---\nStatus: ${motSummary.status}\nExpiry: ${motSummary.expiryDate ?? 'N/A'}\nLast Test: ${motSummary.lastTestDate ?? 'N/A'}\nOdometer: ${motSummary.odometerAtLastTest != null ? `${motSummary.odometerAtLastTest} mi` : 'N/A'}\nAdvisories: ${motSummary.advisoryCount}  Major: ${motSummary.majorCount}  Dangerous: ${motSummary.dangerousCount}\nFlags: ${motSummary.flags.join(' | ') || 'None'}`
      : '\n\n--- MOT data unavailable ---';

    const { error } = await resendClient.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.EMAIL_TO || 'your-email@example.com',
      replyTo: email,
      subject: `[Services] Contact from ${name} — ${safeVrm}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; color: #D4AF37;">Car Nation Services</h1>
            <p style="margin: 4px 0 0;">New Contact Form Submission</p>
          </div>
          <div style="background: #f9f9f9; padding: 24px;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safePhone}">${safePhone}</a></p>
            <p><strong>Registration:</strong> ${safeVrm}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #fff; padding: 12px; border-left: 3px solid #D4AF37; border-radius: 4px;">${safeMessage}</p>
            ${motHtml}
          </div>
        </div>
      `,
      text: `Contact from ${name}\n\nEmail: ${email}\nPhone: ${phone}\nRegistration: ${normalizedVrm}\n\nMessage:\n${message}${motText}`,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
