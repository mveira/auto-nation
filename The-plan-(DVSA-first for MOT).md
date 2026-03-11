The new plan (DVSA-first for MOT)

DVLA VES: reg → vehicle details to show the user for confirmation.

DVSA MOT History API: reg → MOT status/history → MOT expiry (and anything else you want later).

GHL workflows: store mot_expiry_date, compute mot_reminder_date, trigger a workflow that fires on that date.

Step-by-step build (simple + reliable)
Step 1 — Frontend: “Enter reg” + “Find my car”

UI flow

User enters reg

Click “Find my car”

Show a result card + confirm buttons

What you show on the card (from DVLA):

Make, colour, fuel type, year/date of first reg (whatever DVLA gives you)

(Optional) show MOT expiry once you’ve fetched it from DVSA too

DVLA VES is specifically “VRM in → vehicle details out”.

Step 2 — Backend: single endpoint that calls BOTH APIs

Create:
POST /api/vehicle/lookup { vrm }

Backend does:

Validate VRM format

Call DVLA VES → get vehicle details (for confirmation UI).

Call DVSA MOT API → get MOT expiry + status/history. DVSA uses OAuth2 client-credentials and also issues an API key as part of access.

Return a single normalized object to the frontend:

{
  "vrm": "AB12CDE",
  "vehicle": { "make": "...", "colour": "...", "fuelType": "...", "year": "..." },
  "mot": { "expiryDate": "2026-04-18", "status": "valid" }
}

DVSA headers/format vary by versioning, but their docs explicitly require an API key header and an Accept header like application/json+v6.

Step 3 — Verification: user confirms it’s their car

On the frontend:

✅ Yes, that’s my car → continue

❌ No → reset

When they click ✅:

store the returned vehicle + mot in state (and/or DB if you want)

Step 4 — MOT reminders (GHL) using a Custom Date

Because you want:

default 30 days

user can edit lead time

send via GHL workflows (WhatsApp/SMS/email)

Best pattern: compute the reminder date in your backend.

leadDays default: 30

motReminderDate = motExpiryDate - leadDays

Push into GHL contact custom fields:

vehicle_vrm

vehicle_make

vehicle_colour

vehicle_fuel

mot_expiry_date (date)

mot_lead_days (number)

mot_reminder_date (date) ✅ (the trigger date)

mot_opt_in (checkbox/boolean)

preferred_channel (whatsapp/sms/email)

Then in GHL:

Use the Custom Date Reminder workflow trigger on mot_reminder_date.

Or use a Wait action depending on your style; GHL documents the Wait action basics.

Workflow skeleton

Trigger: Custom Date Reminder (mot_reminder_date)

If/Else: mot_opt_in = true

Send message (WhatsApp/SMS/Email)

Include booking link (with reg prefilled)

Step 5 — Booking includes car + MOT details (always)

When user books, your booking payload to GHL should include:

Contact: name/email/phone

Booking: slot + service type + notes

Vehicle snapshot: vrm + dvla fields

MOT snapshot: expiryDate (from DVSA)

Store the vehicle/MOT snapshot on the booking so it doesn’t “change later”.

DVSA setup you’ll need (so you don’t get blocked)

DVSA MOT History API access requires registration, and the docs state it uses OAuth 2.0 client credentials (client id/secret, token url, scope) and you also receive an API key.

So your backend will typically:

Get OAuth access token (client credentials)

Call MOT endpoint with token + required headers (incl. x-api-key + Accept: application/json+v6 per docs)