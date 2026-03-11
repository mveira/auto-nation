import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/utils';
import { normalizeVrm, type MotSummary } from '@/lib/dvsa';
import { createLeadFromBooking } from '@/lib/intake';
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
    const { name, email, phone, service, vehicle, registration, vrm, preferredDate, notes } = body;

    // vrm can come as explicit field or fall back to registration
    const rawVrm: string = vrm || registration || '';

    if (!name || !email || !phone || !service || !vehicle) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }
    if (!rawVrm) {
      return NextResponse.json({ error: 'Vehicle registration (VRM) is required' }, { status: 400 });
    }

    const normalizedVrm = normalizeVrm(rawVrm);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // ── DB write (Lead + MotReport + OutboxEvent) — DVSA enrichment inside ──
    let leadId: string | null = null;
    let motSummary: MotSummary | null = null;
    try {
      const result = await createLeadFromBooking({
        name, email, phone,
        vrm: rawVrm,
        vehicle, service,
        preferredDate: preferredDate || null,
        notes: notes || null,
      });
      leadId = result.leadId;
      motSummary = result.motSummary;
    } catch (err) {
      // DB write failed — log but continue to send email (fallback)
      console.error('[book] Intake DB write failed:', err);
    }

    // ── Fire-and-forget outbox processing (triggers GHL sync) ──
    if (leadId) {
      processOutbox().catch((err) => console.error('[book] Outbox processing error:', err));
    }

    // ── GHL webhook (legacy — kept as fallback until outbox is confirmed working) ──
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_BOOK_URL;
    if (ghlWebhookUrl) {
      fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'services-web',
          type: 'booking',
          page: '/book',
          submittedAt: new Date().toISOString(),
          contact: { name, email, phone },
          booking: {
            serviceSlug: service.toLowerCase().replace(/\s+/g, '-'),
            serviceName: service,
            vehicle,
            registration: normalizedVrm,
            preferredDate: preferredDate || '',
            notes: notes || '',
          },
          mot: motSummary ?? undefined,
        }),
      }).catch((err) => console.error('GHL booking webhook error:', err));
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
    const safeService = escapeHtml(service);
    const safeVehicle = escapeHtml(vehicle);
    const safeRegistration = escapeHtml(normalizedVrm);
    const safePreferredDate = preferredDate ? escapeHtml(preferredDate) : '';
    const safeNotes = notes ? escapeHtml(notes).replace(/\n/g, '<br>') : '';

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
      ? `\n--- MOT Summary (DVSA) ---\nStatus: ${motSummary.status}\nExpiry: ${motSummary.expiryDate ?? 'N/A'}\nLast Test: ${motSummary.lastTestDate ?? 'N/A'}\nOdometer: ${motSummary.odometerAtLastTest != null ? `${motSummary.odometerAtLastTest} mi` : 'N/A'}\nAdvisories: ${motSummary.advisoryCount}  Major: ${motSummary.majorCount}  Dangerous: ${motSummary.dangerousCount}\nFlags: ${motSummary.flags.join(' | ') || 'None'}`
      : '\n--- MOT data unavailable ---';

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
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${safePhone}">${safePhone}</a></p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;">
            <p><strong>Service:</strong> ${safeService}</p>
            <p><strong>Vehicle:</strong> ${safeVehicle}</p>
            <p><strong>Registration:</strong> ${safeRegistration}</p>
            ${safePreferredDate ? `<p><strong>Preferred Date:</strong> ${safePreferredDate}</p>` : ''}
            ${safeNotes ? `<p><strong>Notes:</strong></p><p style="background: #fff; padding: 12px; border-left: 3px solid #D4AF37; border-radius: 4px;">${safeNotes}</p>` : ''}
            ${motHtml}
          </div>
        </div>
      `,
      text: `Booking Request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nVehicle: ${vehicle}\nRegistration: ${normalizedVrm}\nPreferred Date: ${preferredDate || 'N/A'}\nNotes: ${notes || 'None'}${motText}`,
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
