# GSD — Phase 0
# Current State Map + Integration Plan + UI Consistency Audit

You are operating under strict GSD discipline.

## Source of Truth
Read and follow:
- `./ARCHITECTURE.md`
- `./PSYCHOLOGY.md`

Architecture rules override all assumptions.

## Hard Constraints
- `apps/car-sale` already exists. DO NOT recreate it.
- Do NOT implement Strapi.
- Do NOT implement GHL.
- Do NOT modify code.
- This phase is analysis + structured planning only.
- No refactors. No file edits.

---

# Objective

Produce a concise, structured execution plan to:

1) Finish `apps/car-sale` by preparing it for:
   - Strapi vehicle/content integration
   - GHL lead integration

2) Ensure `apps/services-web` will match car-sale UI exactly.

This phase defines integration points only.
It does NOT implement them.

---

# Tasks

## 1️⃣ Current State Map

Inspect the repository and output:

- Repo tree (depth 3)
- Apps present
- car-sale routes/pages
- car-sale API routes (contact/schedule/etc.)
- Current data layer:
  - `cars.service.ts`
  - `cars.ts`
  - any hardcoded inventory
- Current env var usage
- Current Netlify configuration location

Describe the actual current data flow in car-sale.

---

## 2️⃣ Integration Requirements — car-sale

Define what will be required (do not implement):

### Strapi Data Requirements
- Required vehicle fields
- Featured logic
- Sold logic
- Sold archive logic
- Slug handling

List expected Strapi queries/endpoints (conceptual only).

### GHL Lead Requirements
For each lead type:
- Vehicle enquiry
- Test drive booking
- General contact

Define:
- Required fields
- Pipeline stage mapping
- lead_source handling
- UTM handling

### Environment Variables Required (keys only)

---

## 3️⃣ UI Consistency Audit

Evaluate car-sale design implementation:

- Color tokens
- Radius usage
- Typography usage
- Spacing patterns
- Navigation + Footer structure

Define:

### Shared Components To Extract (packages/ui)
- Navigation
- Footer
- Container
- Section
- Any base layout wrappers

List differences that must be corrected for consistency.

Do NOT rewrite components.

---

## 4️⃣ Output Required

Return output in this exact structure:

A) Current State Map  
B) car-sale Integration Requirements  
C) UI Consistency Plan  
D) Recommended Next Phases (minimal, shipping mode)

Keep output concise and structured.
No speculation.
No implementation.

---

Begin.
