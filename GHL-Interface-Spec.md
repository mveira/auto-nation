# GHL Interface Spec (Contract)

## Purpose
Defines the minimum information an AI assistant needs to implement and maintain the GHL integration.
No UI instructions. No snapshot setup guides.

---

## Entities

### Contact (GHL)
Primary match: phone
Fallback match: email

Fields used:
- preferred_channel: whatsapp | sms | email
- mot_opt_in: boolean (optional if per-vehicle is used)

---

### Vehicle (GHL Custom Object)
Unique key: vrm

Fields:
- vrm (unique)
- make
- colour
- fuelType
- firstRegistrationDate
- motExpiryDate (from DVSA)
- reminderLeadDays (default 30, editable)
- motReminderDate (computed)
- bookedForMotExpiryDate (guard)
- remindersEnabled (boolean)

Associations:
- Contact 1 -> many Vehicles

---

## Workflows (GHL)

### MOT - 30 Day Reminder
Trigger: inbound webhook from backend scheduler
Guard: remindersEnabled = true AND bookedForMotExpiryDate != motExpiryDate
Action: send message using preferred_channel
Output: tag "GARAGE - MOT Reminder Sent"

### MOT - 7 Day Reminder
Trigger: inbound webhook from backend scheduler
Guard: remindersEnabled = true AND bookedForMotExpiryDate != motExpiryDate
Action: send message using preferred_channel
Output: tag "GARAGE - MOT 7 Day Reminder Sent"

### Booking Confirmed
Trigger: GHL calendar booking confirmed (or website booking)
Action: call backend endpoint /api/vehicle/mark-booked with vrm
Output: updates bookedForMotExpiryDate

---

## Integration Endpoints (Backend)

### POST /api/vehicle/lookup
Input: vrm
Output: DVLA vehicle details + DVSA mot data

### POST /api/vehicle/save
Input: contact + vehicle + consent + leadDays
Effect: upsert contact, upsert vehicle, associate, compute motReminderDate

### POST /api/vehicle/mark-booked
Input: vrm (+ optional motExpiryDate)
Effect: set bookedForMotExpiryDate = motExpiryDate on Vehicle record

### Daily Scheduler
Runs daily:
- if daysUntil(motExpiryDate) == reminderLeadDays and not booked -> trigger MOT 30 workflow
- if daysUntil(motExpiryDate) == 7 and not booked -> trigger MOT 7 workflow