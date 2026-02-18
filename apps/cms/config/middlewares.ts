import type { Core } from '@strapi/strapi';

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'cdn.autotrader.co.uk'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'cdn.autotrader.co.uk'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: env('CORS_ORIGINS', 'http://localhost:3000')
        .split(',')
        .map((v: string) => v.trim()),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
