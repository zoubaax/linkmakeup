export const PROFILE_DETAILS_PATH = '/dashboard/profile';
export const ANALYTICS_PATH = '/dashboard/analytics';

export const STUDIO_NAV = [
  {
    to: '/dashboard',
    end: true,
    label: 'Studio Overview',
    shortLabel: 'Studio',
  },
  {
    to: ANALYTICS_PATH,
    label: 'Analytics',
    shortLabel: 'Analytics',
  },
  {
    to: PROFILE_DETAILS_PATH,
    label: 'Profile Identity',
    shortLabel: 'Profile',
  },
];
