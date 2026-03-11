#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// Outbox processor — run as a standalone script or cron job
// Usage: npx tsx scripts/process-outbox.ts [--once]
// ---------------------------------------------------------------------------
// Without --once: polls every 5 seconds (for local dev)
// With --once: processes one batch and exits (for cron / CI)
// ---------------------------------------------------------------------------

import { processPendingEvents } from '../lib/outbox'

const runOnce = process.argv.includes('--once')
const POLL_INTERVAL = 5_000

async function run() {
  console.log('[Outbox] Processor started', runOnce ? '(single run)' : '(polling)')

  if (runOnce) {
    const count = await processPendingEvents()
    console.log(`[Outbox] Processed ${count} events`)
    process.exit(0)
  }

  // Polling mode
  while (true) {
    try {
      const count = await processPendingEvents()
      if (count > 0) {
        console.log(`[Outbox] Processed ${count} events`)
      }
    } catch (err) {
      console.error('[Outbox] Processor error:', err)
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL))
  }
}

run()
