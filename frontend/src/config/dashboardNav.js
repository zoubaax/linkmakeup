export const THEME_PATH = '/dashboard/theme';
export const PROFILE_DETAILS_PATH = '/dashboard/profile';
export const ANALYTICS_PATH = '/dashboard/analytics';

export const STUDIO_NAV = [
  {
    to: '/dashboard',
    end: true,
    label: 'Links & Content',
    shortLabel: 'Links',
    icon: 'link',
  },
  {
    to: THEME_PATH,
    label: 'Appearance & Theme',
    shortLabel: 'Theme',
    icon: 'theme',
  },
];

export const TOP_NAV = [
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

