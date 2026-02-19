import { getSyncConfig } from '../src/lib/env';

export default {
  [process.env.AUTO_TRADER_SYNC_CRON ?? '*/10 * * * *']: async ({ strapi }) => {
    const config = getSyncConfig();

    if (!config.enabled) {
      strapi.log.debug('[auto-trader-sync] Sync disabled, skipping');
      return;
    }

    try {
      await strapi.service('api::vehicle.auto-trader-sync').run({ strapi });
    } catch (err) {
      strapi.log.error('[auto-trader-sync] Cron run failed:', err);
    }
  },
};
