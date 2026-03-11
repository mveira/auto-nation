# Auto Nation — TODO

Last updated: 2026-03-05

---

## Confirmed-Slot Booking (current work)

Patch diff reviewed. The following steps must be completed to ship the confirmed-slot booking system.

### Code changes (apply patch)

- [ ] 1. Update `prisma/schema.prisma` — add `ServiceConfig`, `Appointment`, `VehicleType` enum; extend `Lead` (pipeline field), `GhlLink` (ghlAppointmentId)
- [ ] 2. Create `lib/service-config.ts` — Supabase lookup for service config + duration helpers
- [ ] 3. Create `lib/ghl-calendar.ts` — GHL calendar free-slots + create appointment
- [ ] 4. Create `app/api/availability/route.ts` — `GET /api/availability` endpoint
- [ ] 5. Update `lib/intake.ts` — add `createConfirmedBooking()` function
- [ ] 6. Update `lib/ghl.ts` — add `syncBookingToGhl()` function
- [ ] 7. Update `lib/outbox.ts` — handle `BookingCreated` event type
- [ ] 8. Update `app/api/book/route.ts` — confirmed-slot booking flow (replaces request-based)
- [ ] 9. Update `app/book/BookClient.tsx` — slot selection UI (service + vehicleType + date + time grid)
- [ ] 10. Update `.env.local.example` — new GHL calendar + pipeline env vars

### Infrastructure (Marcus — manual steps)

- [ ] 11. Create 6 GHL calendars (one per service) — configure slot durations to match:
  - `full-service` — car: 90 min, van: 120 min
  - `interim-service` — car: 60 min, van: 75 min
  - `mot-testing` — car: 45 min, van: 60 min
  - `brake-repairs` — car: 90 min, van: 120 min
  - `tyre-fitting` — car: 45 min, van: 60 min
  - `diagnostics` — car: 60 min, van: 60 min
- [ ] 12. Copy each GHL calendar ID and set the corresponding env vars:
  - `GHL_CAL_FULL_SERVICE`
  - `GHL_CAL_INTERIM_SERVICE`
  - `GHL_CAL_MOT_TESTING`
  - `GHL_CAL_BRAKE_REPAIRS`
  - `GHL_CAL_TYRE_FITTING`
  - `GHL_CAL_DIAGNOSTICS`
- [ ] 13. Create a "Services" pipeline in GHL with stages: BOOKED, IN_PROGRESS, COMPLETE, CANCELLED, NO_SHOW
- [ ] 14. Copy the pipeline ID and BOOKED stage ID into env vars:
  - `GHL_SERVICES_PIPELINE_ID`
  - `GHL_STAGE_ID_BOOKED`

### Database

- [ ] 15. Run Prisma migration: `npx prisma db push` (or `npx prisma migrate dev --name confirmed-slot-booking`)
- [ ] 16. Seed service configs: `npx prisma db seed` (uses `GHL_CAL_*` env vars)
- [ ] 17. Verify service_configs table has 6 rows with real GHL calendar IDs (no PLACEHOLDER values)

### Testing

- [ ] 18. Test `GET /api/availability?serviceKey=mot-testing&vehicleType=car&date=YYYY-MM-DD` — returns slots from GHL
- [ ] 19. Test booking UI end-to-end: select service, vehicle type, date, pick slot, fill details, submit
- [ ] 20. Verify Supabase has: Lead (pipeline=SERVICES, status=booked) + Appointment (correct start/end)
- [ ] 21. Verify outbox processes: GHL contact created, calendar appointment created, opportunity at BOOKED stage
- [ ] 22. Verify Resend email shows confirmed slot time (not "preferred date")
- [ ] 23. Test edge cases: no slots available, past date rejected, missing fields rejected

### Deploy

- [ ] 24. Add all new env vars to Netlify site settings
- [ ] 25. Deploy services-web to Netlify
- [ ] 26. Smoke-test production booking flow

---

## Remaining services-web work (after booking is shipped)

- [ ] Build `/services/[slug]` detail pages
- [ ] Add `app/sitemap.ts`
- [ ] Add `app/robots.ts`
- [ ] Replace placeholder contact details with real values
- [ ] Fix Hero Google Rating (env-driven or remove)
- [ ] Wire cross-site navigation (car-sale <-> services-web)

## Blocked / later

- [ ] Auto Trader feed parser — blocked on feed access
- [ ] Shared UI extraction (`packages/ui`) — Phase 4
- [ ] car-sale Strapi integration — Phase 5
- [ ] Sales pipeline + payments — after garage-admin
