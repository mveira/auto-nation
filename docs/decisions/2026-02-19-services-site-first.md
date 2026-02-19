cat > "docs/decisions/Decision — Services Site First (2026-02-19).md" << 'EOF'
# Decision — Services Site First (2026-02-19)

## Context
Auto Trader feed access is pending.
Client requires the services website urgently.

## Decision
Pause car-sale Strapi integration and Auto Trader parser work.
Prioritise building apps/services-web.

## Consequences
- Strapi CMS remains active and ready.
- Vehicle sync skeleton remains in place but inactive.
- Services site becomes Phase 3 priority.
- Shared UI extraction will happen after services site foundation is built.

## Resume Condition
Car-sale integration resumes once Auto Trader feed access is available.
EOF
