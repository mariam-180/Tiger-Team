export const adminSections = [
  {
    route: '/admin/users',
    title: 'People & credit',
    shortTitle: 'Users',
    icon: '01',
    description:
      'View and edit customer details and their recorded credit balance. The site has one administrator and customer accounts.',
    purpose: 'Use when a customer needs an account or balance correction.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/reservations',
    title: 'Reservations',
    shortTitle: 'Reservations',
    icon: '02',
    description:
      "Manage customers' PC bookings: review the selected station, booking times, duration and recorded cost.",
    purpose: 'Manage bookings made by customers.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/orders',
    title: 'Product orders',
    shortTitle: 'Orders',
    icon: '03',
    description:
      'Manage customer orders placed through the shop. Review the items, total amount and order status.',
    purpose: 'Manage purchases already placed.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/products',
    title: 'Product catalogue',
    shortTitle: 'Products',
    icon: '04',
    description:
      'Manage what appears in the shop: create and edit products, upload images, and update prices, categories and available stock.',
    purpose: 'Manage items offered for sale.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/events',
    title: 'Race registrations',
    shortTitle: 'Events',
    icon: '05',
    description:
      'Review who registered for each existing race and update their registration status. This screen does not create new races.',
    purpose: 'Manage race participants and registrations.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/streaming',
    title: 'Live broadcast',
    shortTitle: 'Streaming',
    icon: '06',
    description:
      'Find the OBS connection settings and playback addresses used for live broadcasts. Broadcasting requires the media server and a publisher.',
    purpose: 'Prepare a broadcast and check connection details.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/controllers',
    title: 'Site settings',
    shortTitle: 'Settings',
    icon: '07',
    description:
      'Edit existing site switches and configured dates. Setting names are used by the site, so check their purpose before changing them.',
    purpose: 'Configure how existing site features behave.',
    role: 'SUPER_USER',
  },
  {
    route: '/admin/reports',
    title: 'Activity reports',
    shortTitle: 'Reports',
    icon: '08',
    description:
      'Review recorded administrative activity: who changed a record, what action was performed and when it happened.',
    purpose: 'Review the activity history. Reading a report changes nothing.',
    role: 'SUPER_USER',
  },
];

const levels = { END_USER: 1, EMPLOYEE_USER: 2, SUPER_USER: 3 };
export const visibleAdminSections = (role) =>
  adminSections.filter(
    (section) => (levels[role] || 0) >= levels[section.role],
  );
