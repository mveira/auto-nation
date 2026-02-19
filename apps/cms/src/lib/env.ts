/**
 * Environment helpers for Auto Trader sync configuration.
 * No external dependencies — reads process.env directly.
 */

export interface SyncConfig {
  enabled: boolean;
  feedUrl: string;
  cronExpression: string;
  soldVisibleDays: number;
}

export function getSyncConfig(): SyncConfig {
  return {
    enabled: process.env.AUTO_TRADER_SYNC_ENABLED === 'true',
    feedUrl: process.env.AUTO_TRADER_FEED_URL ?? '',
    cronExpression: process.env.AUTO_TRADER_SYNC_CRON ?? '*/10 * * * *',
    soldVisibleDays: parseInt(process.env.SOLD_VISIBLE_DAYS ?? '30', 10) || 30,
  };
}
