1. Overview (Updated)

This system now includes:

🚗 Garage Services Website
🚙 Car Sales Website
🚘 Vehicle Registry Layer (Custom Object per VRM)
⏰ Automated MOT Reminder Engine (30-day + 7-day logic)
🔐 One GHL Sub-Account
👤 Controlled Client Portal

Core Upgrade:

Vehicles are no longer stored as flat contact fields.

Each vehicle is its own structured record.

MOT automation runs per vehicle.

Reminders stop automatically when booked.

2. Updated System Architecture
SUB-ACCOUNT
├── PIPELINE: GARAGE – Services
├── PIPELINE: SALES – Vehicles
├── CUSTOM OBJECT: VEHICLE
│     ├── VRM (unique)
│     ├── DVLA Snapshot Fields
│     ├── MOT Expiry (DVSA)
│     ├── Reminder Lead Days
│     ├── Reminder Date
│     ├── Booked For MOT Date
│     └── Reminders Enabled
├── WORKFLOWS: GARAGE – ...
├── WORKFLOWS: SALES – ...
├── WORKFLOWS: MOT – Reminder 30 Day
├── WORKFLOWS: MOT – Reminder 7 Day
├── FORMS: GARAGE – ...
├── FORMS: SALES – ...
├── CALENDAR: GARAGE – Service Booking
├── CALENDAR: SALES – Test Drive
└── TAGS separated by prefix

New rule:
Vehicle data is never stored directly on contact except for display convenience.

3. Snapshot Loading Strategy (Modified)

After loading snapshots:

Add Custom Object Manually

Create:

CUSTOM OBJECT → VEHICLE

Fields:

vrm (UNIQUE)

make

colour

fuelType

firstRegistrationDate

motExpiryDate

reminderLeadDays (default 30)

motReminderDate

bookedForMotExpiryDate

remindersEnabled

Associate VEHICLE ↔ CONTACT.

This becomes the foundation for all MOT automation.

4. Pipeline Design (No Change)

Garage and Sales pipelines remain separated.

Vehicle records are NOT pipeline entries.

Pipelines track:

Enquiries

Jobs

Sales

Vehicles track:

MOT state

Reminder engine

Ownership association

5. Forms Structure (Updated)
GARAGE – Service Form (Updated)

Fields:

Name
Phone
Email
Vehicle Registration

NEW:
Checkbox: “Remind me before MOT expires”
Select: Preferred Channel (SMS / WhatsApp / Email)
Optional: Lead Days Override

Hidden:
Lead Type = Service

Important:
The form itself does NOT calculate reminders.
Your backend does.

6. Workflow Architecture (Major Upgrade)
Critical Rule

Still no broad triggers.

GARAGE Workflows (Updated)
Trigger:

Form Submitted → GARAGE – Service Form

Actions:

Create / Update Contact

Create / Update VEHICLE object (via webhook or API)

Create Opportunity → GARAGE – Services → New Enquiry

Confirmation SMS

Internal Notification

Reminder logic is NOT inside this workflow.

NEW SECTION — MOT Reminder Engine

We now add:

Workflow 1 — MOT – 30 Day Reminder

Trigger:
Incoming Webhook from backend daily scheduler

Condition:
Vehicle.remindersEnabled = true
Vehicle.bookedForMotExpiryDate ≠ Vehicle.motExpiryDate

Actions:
Send reminder message
Tag: GARAGE – MOT Reminder Sent

Workflow 2 — MOT – 7 Day Reminder

Trigger:
Incoming Webhook from backend daily scheduler

Condition:
Vehicle.bookedForMotExpiryDate ≠ Vehicle.motExpiryDate

Actions:
Send final reminder
Tag: GARAGE – MOT 7 Day Reminder Sent

Why Webhook Trigger Instead of Custom Date Trigger?

Because:

You support multiple vehicles per contact.

You need conditional booking checks.

You need 30-day AND 7-day logic.

You may change lead days dynamically.

Backend scheduler = cleaner, deterministic, scalable.

7. Calendar Setup (Updated)
GARAGE – Service Booking Calendar

When booking confirmed:

Trigger Workflow:
GARAGE – Booking Confirmed

Actions:

Update VEHICLE object:
bookedForMotExpiryDate = motExpiryDate

Move Opportunity to:
Booked In

This prevents 7-day reminder from firing.

8. Tagging System (Expanded)

Garage Tags:

GARAGE – Service Lead
GARAGE – MOT
GARAGE – Repair
GARAGE – Returning Customer
GARAGE – MOT Reminder Sent
GARAGE – MOT 7 Day Reminder Sent

Sales Tags unchanged.

9. Client Portal Configuration (No Change)

Client still sees:

Dashboard
Conversations
Opportunities
Contacts
Calendar
Reporting

They do NOT see:
Custom Object configuration
Reminder logic
DVSA integration
Workflow backend

System control retained.

10. Governance Model (Updated)

You control:

DVLA integration
DVSA integration
Vehicle creation logic
Reminder calculation logic
Daily scheduler
Webhook triggers
Booking guard logic

Client controls:

Moving jobs
Replying to leads
Managing appointments

They cannot break reminder engine.

11. Operational Flow (Rewritten)
Vehicle Registration Flow

User enters VRM →
Backend calls DVLA + DVSA →
User confirms vehicle →
Contact + Vehicle record created →
Reminder engine activated.

Reminder Flow

Daily scheduler runs:

If:
Days until MOT = reminderLeadDays
AND not booked
→ Trigger 30-day workflow

If:
Days until MOT = 7
AND not booked
→ Trigger 7-day workflow

Booking Flow

User books (site or GHL) →
Vehicle updated →
bookedForMotExpiryDate = motExpiryDate →
Future reminders suppressed.

12. Quality Control Checklist (Updated)

Before going live:

VEHICLE Custom Object created
VRM set as unique
DVLA integration tested
DVSA integration tested
Daily scheduler running
Webhook connected to GHL
Booking updates vehicle correctly
30-day reminder tested
7-day reminder tested
Reminder stops after booking

13. Scaling Strategy (Upgraded)

When duplicating for multiple dealers:

Include in MASTER SNAPSHOT:

Garage System
Sales System
Vehicle Custom Object
Reminder Workflows
Webhook endpoints documented

Do not rebuild reminder engine per client.

14. Final System Summary (Rewritten)

1 GHL Sub-Account
├── GARAGE – Services System
├── SALES – Vehicles System
├── VEHICLE Registry Layer
├── Automated MOT Reminder Engine
├── Unified Inbox
└── Controlled Client Portal

This now provides:

Clean separation
Multi-vehicle per customer
Professional MOT automation
Reliable booking guard
Scalable data structure
Enterprise-level delivery model