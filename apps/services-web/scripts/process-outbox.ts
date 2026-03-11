/**
 * CLI entry point for outbox processor.
 *
 * Usage:
 *   npx tsx scripts/process-outbox.ts
 *   npm run outbox:process
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Set global prisma so ../lib/outbox (via ../lib/db) uses this instance
const prisma = new PrismaClient();
(globalThis as unknown as { prisma: typeof prisma }).prisma = prisma;

import { processOutbox } from '../lib/outbox';

processOutbox()
  .then(({ processed, failed }) => {
    console.log(`[outbox] Done. Processed: ${processed}, Failed: ${failed}`);
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.error('[outbox] Fatal error:', err);
    prisma.$disconnect();
    process.exit(1);
  });
