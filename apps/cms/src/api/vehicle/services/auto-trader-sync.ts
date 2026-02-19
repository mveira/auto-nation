import { getSyncConfig } from '../../../lib/env';

const TAG = '[auto-trader-sync]';

// TODO: Replace with real feed parser once feed schema is finalized
interface FeedVehicle {
  externalId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  colour?: string;
  doors?: number;
  engineSize?: string;
  description?: string;
  images?: string[];
  sold?: boolean;
}

/**
 * Generate a URL-safe slug from vehicle fields.
 * Called once at creation — never overwritten on update.
 */
function generateSlug(v: FeedVehicle): string {
  const base = `${v.make}-${v.model}-${v.year}-${v.externalId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base;
}

/**
 * TODO: Parse raw feed response into FeedVehicle[].
 * Placeholder — returns empty array until feed schema is known.
 */
function parseFeed(_rawBody: string): FeedVehicle[] {
  // TODO: Implement once Auto Trader feed format is confirmed (CSV / JSON / XML)
  return [];
}

export default {
  async run({ strapi }) {
    const config = getSyncConfig();

    if (!config.enabled) {
      strapi.log.debug(`${TAG} Sync disabled, skipping`);
      return;
    }

    if (!config.feedUrl) {
      strapi.log.error(`${TAG} AUTO_TRADER_FEED_URL is required when sync is enabled, skipping`);
      return;
    }

    // 1. FETCH
    let rawBody: string;
    try {
      const response = await fetch(config.feedUrl);
      if (!response.ok) {
        strapi.log.error(`${TAG} Feed fetch failed: HTTP ${response.status}`);
        return;
      }
      rawBody = await response.text();
      strapi.log.info(`${TAG} Downloaded feed: ${rawBody.length} bytes`);
    } catch (err) {
      strapi.log.error(`${TAG} Feed fetch error:`, err);
      return;
    }

    // 2. PARSE
    const feedVehicles = parseFeed(rawBody);

    // Safety: if feed returned zero vehicles, do not run sold detection or upserts
    if (feedVehicles.length === 0) {
      strapi.log.warn(`${TAG} Parsed 0 vehicles from feed — skipping upsert and sold detection`);
      return;
    }

    // 3. BUILD LOOKUP
    const feedIds = new Set(feedVehicles.map((v) => v.externalId));
    const now = new Date().toISOString();

    const stats = { created: 0, updated: 0, markedSold: 0, errors: 0 };

    // 4. UPSERT each feed vehicle
    for (const feedVehicle of feedVehicles) {
      try {
        const existing = await strapi.documents('api::vehicle.vehicle').findFirst({
          filters: { externalId: feedVehicle.externalId },
        });

        if (existing) {
          // UPDATE — never overwrite slug or firstSeenAt
          await strapi.documents('api::vehicle.vehicle').update({
            documentId: existing.documentId,
            data: {
              // TODO: Map remaining feed fields here once schema is confirmed
              title: feedVehicle.title,
              make: feedVehicle.make,
              model: feedVehicle.model,
              year: feedVehicle.year,
              price: feedVehicle.price,
              mileage: feedVehicle.mileage ?? null,
              fuelType: feedVehicle.fuelType ?? null,
              transmission: feedVehicle.transmission ?? null,
              bodyType: feedVehicle.bodyType ?? null,
              colour: feedVehicle.colour ?? null,
              doors: feedVehicle.doors ?? null,
              engineSize: feedVehicle.engineSize ?? null,
              description: feedVehicle.description ?? null,
              images: feedVehicle.images ?? null,
              status: feedVehicle.sold ? 'sold' : 'live',
              soldAt: feedVehicle.sold ? (existing.soldAt ?? now) : null,
              lastSeenAt: now,
              // slug: intentionally NOT updated
            },
          });
          stats.updated++;
        } else {
          // CREATE — set slug + firstSeenAt once
          await strapi.documents('api::vehicle.vehicle').create({
            data: {
              externalId: feedVehicle.externalId,
              slug: generateSlug(feedVehicle),
              title: feedVehicle.title,
              make: feedVehicle.make,
              model: feedVehicle.model,
              year: feedVehicle.year,
              price: feedVehicle.price,
              mileage: feedVehicle.mileage ?? null,
              fuelType: feedVehicle.fuelType ?? null,
              transmission: feedVehicle.transmission ?? null,
              bodyType: feedVehicle.bodyType ?? null,
              colour: feedVehicle.colour ?? null,
              doors: feedVehicle.doors ?? null,
              engineSize: feedVehicle.engineSize ?? null,
              description: feedVehicle.description ?? null,
              images: feedVehicle.images ?? null,
              status: feedVehicle.sold ? 'sold' : 'live',
              soldAt: feedVehicle.sold ? now : null,
              firstSeenAt: now,
              lastSeenAt: now,
            },
          });
          stats.created++;
        }
      } catch (err) {
        strapi.log.error(`${TAG} Error processing vehicle ${feedVehicle.externalId}:`, err);
        stats.errors++;
      }
    }

    // 5. SOLD DETECTION — live vehicles in Strapi that are missing from the feed
    try {
      const liveVehicles = await strapi.documents('api::vehicle.vehicle').findMany({
        filters: { status: 'live' },
        fields: ['externalId', 'documentId'],
        limit: -1,
      });

      for (const vehicle of liveVehicles) {
        if (!feedIds.has(vehicle.externalId)) {
          await strapi.documents('api::vehicle.vehicle').update({
            documentId: vehicle.documentId,
            data: {
              status: 'sold',
              soldAt: now,
            },
          });
          stats.markedSold++;
        }
      }
    } catch (err) {
      strapi.log.error(`${TAG} Sold detection failed:`, err);
    }

    strapi.log.info(
      `${TAG} Sync complete: ${stats.created} created, ${stats.updated} updated, ${stats.markedSold} marked sold, ${stats.errors} errors`
    );
  },
};
