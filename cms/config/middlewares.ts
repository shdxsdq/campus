import type { Core } from '@strapi/strapi';

const parseList = (value?: string | null) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) ?? [];

const unique = (items: string[]) => Array.from(new Set(items));

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const configuredOrigins = unique([
    ...parseList(env('CORS_ORIGINS')),
    ...parseList(env('FRONTEND_URL')),
  ]);
  const allowedOrigins =
    configuredOrigins.length > 0
      ? configuredOrigins
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const extraImageSources = unique(parseList(env('CSP_IMG_SOURCES')));
  const extraConnectSources = unique(parseList(env('CSP_CONNECT_SOURCES')));
  const allowlist = unique(parseList(env('ADMIN_IP_ALLOWLIST')));

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", ...allowedOrigins, ...extraConnectSources],
            'img-src': ["'self'", 'data:', 'blob:', ...allowedOrigins, ...extraImageSources],
            'media-src': ["'self'", 'data:', 'blob:', ...allowedOrigins, ...extraImageSources],
            upgradeInsecureRequests: env.bool('ENABLE_HTTPS_REDIRECT', false) ? [] : null,
          },
        },
        frameguard: {
          action: 'sameorigin',
        },
        hsts: env.bool('ENABLE_HTTPS_REDIRECT', false)
          ? {
              maxAge: 31536000,
              includeSubDomains: true,
            }
          : false,
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        keepHeaderOnError: true,
      },
    },
    ...(allowlist.length > 0
      ? [
          {
            name: 'strapi::ip' as const,
            config: {
              whitelist: allowlist,
            },
          },
        ]
      : []),
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
