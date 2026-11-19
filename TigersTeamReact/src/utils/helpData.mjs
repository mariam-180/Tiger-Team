export const helpTopics = [
  {
    id: 'booking',
    group: 'Reservations',
    question: 'How do I book a racing session?',
    answer:
      'Open Reservations, choose a location, select your date, start time and session length, then check availability. Choose an available PC and review the details before confirming.',
    link: '/reservations',
    action: 'Choose a location',
  },
  {
    id: 'availability',
    group: 'Reservations',
    question: 'Does checking availability reserve my PC?',
    answer:
      'No. Checking availability shows the stations available for your selected time. Your reservation is created only when the server accepts your confirmation. Availability may change before then.',
  },
  {
    id: 'account',
    group: 'Accounts',
    question: 'Do I need an account?',
    answer:
      'You can browse products and check PC availability without signing in. Sign in with a verified account to confirm a reservation or place an order.',
    link: '/registration',
    action: 'Sign in or create an account',
  },
  {
    id: 'verify',
    group: 'Accounts',
    question: 'Why am I being asked to verify my email?',
    answer:
      'After creating an account, open the verification link sent to your email before signing in. Check your spam folder if the message is not in your inbox.',
  },
  {
    id: 'password',
    group: 'Accounts',
    question: 'What if I forget my password?',
    answer:
      'Choose Forgot password on the sign-in page and enter your account email. Follow the reset link in the email to choose a new password.',
    link: '/registration',
    action: 'Open sign in',
  },
  {
    id: 'products',
    group: 'Products',
    question: 'How do I find products and place an order?',
    answer:
      'Choose a category on the Products page to see its items. Open product details, add items to your cart and review the quantities. Sign in before checkout. An empty category means no products are currently listed in that category.',
    link: '/products',
    action: 'Explore products',
  },
  {
    id: 'credit',
    group: 'Accounts',
    question: 'Why could my booking or checkout be declined?',
    answer:
      'Check the message shown with your request. An expired session, insufficient account credit, unavailable PC, or changed product stock can prevent confirmation. Review your account and retry only after resolving the issue.',
  },
  {
    id: 'live',
    group: 'Live',
    question: 'How do I watch a live broadcast?',
    answer:
      'Open the Live page. It checks for an active broadcast automatically. When one is available, the video player appears. If you see Off air, no broadcast is currently available.',
    link: '/live',
    action: 'Open live room',
  },
];
export function filterHelp(topics, query = '', group = 'All') {
  const term = query.trim().toLowerCase();
  return topics.filter(
    (topic) =>
      (group === 'All' || topic.group === group) &&
      `${topic.question} ${topic.answer}`.toLowerCase().includes(term),
  );
}
