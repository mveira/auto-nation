# Auto-Nation Project Rules

This project uses a strict 2-tier UI governance system.

---

## Default UI Execution Rule

For ANY frontend, layout, styling, animation, or UI-related task:

→ Always use skill: ui-two-tier

Do NOT manually run ux-structure or frontend-aesthetics separately unless explicitly instructed.

---

## UI Governance Model

### Tier 1 — UX Structure
Skill: ux-structure  
Responsible for:
- Layout
- Hierarchy
- Component structure
- States (loading, empty, error)
- Conversion clarity
- Accessibility logic

### Tier 2 — Frontend Aesthetics
Skill: frontend-aesthetics  
Responsible for:
- Typography
- Color systems (CSS variables)
- Motion
- Spatial rhythm
- Background depth
- Visual polish

---

## Enforcement Rules

1. Tier 1 MUST complete before Tier 2 begins.
2. Tier 2 may NOT modify:
   - Section order
   - Component hierarchy
   - UX logic
   - Conversion flow
3. No structural redesign during aesthetic pass.
4. No generic AI aesthetics.
5. Clarity always overrides creativity.

Violation of these rules means the output must be revised.