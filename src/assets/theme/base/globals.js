import colors from 'assets/theme/base/colors';

const { info, dark } = colors;

export default {
  html: {
    scrollBehavior: 'smooth',
    backgroundColor: '#060708',
  },
  body: {
    backgroundColor: '#060708',
    color: '#f4f6f8',
    fontSmoothing: 'antialiased',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  'button, a, input, select, textarea': {
    '&:focus-visible': {
      outline: '3px solid #ff4b4b',
      outlineOffset: '3px',
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '*, *::before, *::after': {
      scrollBehavior: 'auto !important',
      animationDuration: '0.01ms !important',
      animationIterationCount: '1 !important',
      transitionDuration: '0.01ms !important',
    },
  },
  '*, *::before, *::after': {
    margin: 0,
    padding: 0,
  },
  'a, a:link, a:visited': {
    textDecoration: 'none !important',
  },
  'a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited': {
    color: `${dark.main} !important`,
    transition: 'color 150ms ease-in !important',
  },
  'a.link:hover, .link:hover, a.link:focus, .link:focus': {
    color: `${info.main} !important`,
  },
};
