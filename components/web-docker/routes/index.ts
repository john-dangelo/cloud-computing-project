/**
 * Define Routes configuration
 */

import { RouteItem } from '../types';

const cs = (param: RouteItem) => param;

export const ROUTES = {
  HOME: cs({
    label: 'Home',
    href: {
      pathname: '/',
    },
  }),
  SUBMIT: cs({
    label: 'Submit',
    href: {
      pathname: '/submit',
    },
  }),
  INFO: cs({
    label: 'Info',
    href: {
      pathname: '/info',
    },
  }),
} as const;
