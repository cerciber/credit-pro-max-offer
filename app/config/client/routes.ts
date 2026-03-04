import type { RouteConfig } from '../routes';

export const CLIENT_ROUTES_CONFIG: RouteConfig = {
  publicRoutes: {},
  privateRoutes: {
    offer: {
      path: '/offer',
      label: 'Oferta',
      roles: ['admin', 'client'],
    },
  },
} as const;

export const CLIENT_DEFAULT_ROUTES = {
  privateRoute: CLIENT_ROUTES_CONFIG.privateRoutes.offer,
};

export const CLIENT_API_ROUTES = {};
