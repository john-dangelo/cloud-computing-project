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
  CREATE_JOBS: cs({
    label: 'Create jobs',
    href: {
      pathname: '/create-jobs',
    },
  }),
  CREATE_WORKFLOWS: cs({
    label: 'Create workflows',
    href: {
      pathname: '/create-workflows',
    },
  }),
  CREATE_CONTAINERS: cs({
    label: 'Create components',
    href: {
      pathname: '/create-components',
    },
  }),
  INFO: cs({
    label: 'Info',
    href: {
      pathname: '/info',
    },
  }),
  JOB_INFO: cs({
    label: 'Job info',
    href: {
      pathname: '/job',
    },
  }),
  JOB_RESULT: cs({
    label: 'Job result',
    href: {
      pathname: '/result',
    },
  }),
} as const;
