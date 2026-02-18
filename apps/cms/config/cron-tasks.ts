export default {
  // Runs every 10 minutes
  '*/10 * * * *': async ({ strapi }) => {
    try {
      await strapi.service('api::vehicle.auto-trader-sync').run();
      strapi.log.info('Auto Trader sync completed');
    } catch (err) {
      strapi.log.error('Auto Trader sync failed', err);
    }
  },
};
