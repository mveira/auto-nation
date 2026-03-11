# Auto Nation — System Architecture

## Overview

Auto Nation is a modern automotive platform composed of:

- two public websites
- an internal garage dashboard
- a shared database
- external integrations for messaging, calendars, and vehicle data

The system is designed so that **Supabase is the system of record**, while
external systems provide specialised services such as messaging, scheduling,
and workshop management.

---

# Core Principles

1. **Supabase is the source of truth**
   All operational data must be stored in Supabase.

2. **External platforms are service providers**
   GHL, DVSA, and other APIs are integrations — not the primary data store.

3. **Garage staff interact only with the Admin Dashboard**
   Garage staff must not need access to GHL or other backend systems.

4. **Confirmed booking model**
   Customers only see available slots and bookings are confirmed immediately.

5. **Systems must degrade gracefully**
   If external services fail (DVSA, GHL), the core booking flow must still work.

---

# Applications

## apps/car-sale
Next.js App Router application.

Responsibilities:
- vehicle listing pages
- vehicle detail pages
- vehicle enquiries
- sales lead capture

Vehicle inventory originates from the Auto Trader partner feed.

---

## apps/services-web
Next.js App Router application.

Responsibilities:
- service information pages
- booking system
- vehicle lookup
- DVSA MOT enrichment
- service enquiries

Customers can select services and book available time slots.

---

## apps/garage-admin
Internal Next.js dashboard used by garage staff.

Responsibilities:

### Services
- manage bookings
- view daily schedule
- track service pipeline
- view vehicle MOT history

### Sales
- manage vehicle sales pipeline
- record deposits
- track payment history

### Communication
- view conversations with customers
- send messages (SMS / WhatsApp / Email)

Garage staff interact only with this system.

---

# Database

## Supabase (Postgres)

Supabase is the **system of record** for the platform.

Primary data stored:

- leads
- appointments
- vehicles
- MOT reports
- conversations
- payments
- service catalog configuration
- pipeline configuration

All dashboards and websites read data from Supabase.

External integrations must synchronise with Supabase.

---

# External Systems

## GoHighLevel (GHL)

GHL is used as an **automation and communications engine**.

Responsibilities:

- calendar availability
- appointment reminders
- messaging (SMS, WhatsApp, Email)
- workflow automations

Garage staff do **not** interact directly with GHL.

The platform communicates with GHL through API integrations.

---

## DVSA MOT History API

Used to enrich vehicle data with MOT history.

Data retrieved:

- MOT expiry
- advisory counts
- major faults
- dangerous faults
- mileage history

DVSA failures must **never block bookings**.

---

## GDS Workshop

Existing workshop management system used by the garage.

Handles:

- workshop job sheets
- parts ordering
- invoices
- technician workflow

Service payments are handled inside GDS and are **not processed by this platform**.

---

# Booking System

The services platform uses a **confirmed slot model**.

Customers see real availability and select a time slot.

Booking flow:

1. Customer selects service
2. Customer selects vehicle type
3. Available slots are retrieved from calendar
4. Customer selects a slot
5. Booking is created

System actions:

- appointment stored in Supabase
- lead created in Supabase
- GHL contact created/updated
- GHL calendar appointment created
- MOT history fetched from DVSA (best effort)

Bookings immediately enter the **BOOKED stage**.

---

# Service Configuration

Service durations are defined in a **service catalog**.

Each service stores:

- name
- slug
- duration by vehicle type
- optional buffer time
- associated calendar

Example:
service_catalog

 - mot-testing

 - full-service

 - interim-service


Vehicle types supported:

- car
- van

Durations are configurable through the Admin Dashboard.

---

# Pipelines

## Services Pipeline

Stages:

- BOOKED
- IN_PROGRESS
- COMPLETE
- CANCELLED
- NO_SHOW

---

## Sales Pipeline

Stages:

- NEW_VEHICLE_ENQUIRY
- CONTACTED
- VIEWING_BOOKED
- DEPOSIT_TAKEN
- DEAL_AGREED
- SOLD
- LEFT_REVIEW
- LOST

---

# Payments

Service payments are handled inside **GDS Workshop**.

The platform does **not process service payments**.

Vehicle sales may include:

- deposit payments
- full balance payments

Payment records are stored in Supabase.

Both online payments and manual payments can be recorded.

---

# Deployment

## Hosting

Websites:
- Netlify

Database:
- Supabase

Automations / messaging:
- GoHighLevel

Workshop software:
- GDS Workshop (external)

---

# Deployment Order

1. Supabase schema and database setup
2. DVSA integration
3. Booking system
4. Garage Admin dashboard
5. GHL integrations
6. Sales payment system