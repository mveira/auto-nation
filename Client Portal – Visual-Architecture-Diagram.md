USER
  |
  | enters VRM
  v
WEBSITE (Garage / Sales)
  |
  v
BACKEND API
  |-- calls DVLA -> vehicle identity (make/colour/fuel/etc.)
  |-- calls DVSA -> MOT expiry/status/history
  |
  v
CONFIRMATION UI (Is this your car?)
  |
  | yes + consent + channel + lead days
  v
GHL (Single Sub-Account)
  |
  |-- Upsert CONTACT (phone-first, email fallback)
  |-- Upsert VEHICLE custom object (VRM unique)
  |-- Associate Contact ↔ Vehicle (1 contact : many vehicles)
  |
  v
DAILY SCHEDULER (your backend)
  |
  |-- If MOT due in leadDays (default 30) AND not booked -> trigger WF: MOT 30
  |-- If MOT due in 7 days AND not booked -> trigger WF: MOT 7
  |
  v
GHL WORKFLOWS
  |
  |-- Send WhatsApp/SMS/Email via preferred channel
  |
  v
BOOKING (two routes)
  |
  |-- Website booking -> backend marks vehicle booked
  |-- GHL calendar booking -> workflow/webhook marks vehicle booked
  |
  v
VEHICLE UPDATED
  |
  |-- bookedForMotExpiryDate = current motExpiryDate
  |-- follow-up reminder suppressed
  