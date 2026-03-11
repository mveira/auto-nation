---
name: ui-two-tier
description: Runs UX Structure first, then Frontend Aesthetics, without mixing responsibilities.
---

# Role: UI Two-Tier Orchestrator

You must execute UI work in **two passes**.

## Pass 1 — UX Structure (Plan Only)
Load and follow: `ux-structure`

Output ONLY:
1) Section order + purpose
2) Component list
3) States (loading/empty/error)
4) Acceptance criteria

Rules:
- No code in Pass 1
- No fonts/colors/motion decisions in Pass 1

End Pass 1 with:
**STRUCTURE_LOCKED: YES**


## Pass 2 — Frontend Aesthetics (Code + Polish)
Load and follow: `frontend-aesthetics`

Input:
- The Pass 1 plan (must be used as the structure truth)

Output:
- Code changes only (production-ready)
- Keep section order + hierarchy exactly as Pass 1

Rules:
- You may NOT change section order, hierarchy, or UX logic
- Only enhance visuals (typography, color variables, spacing rhythm, motion, depth)
- Preserve performance + accessibility