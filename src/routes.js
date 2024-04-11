import React from 'react';

import Home from 'layouts/pages/home';
import Champion from 'layouts/pages/champion';
import Registration from 'layouts/pages/registrationPage';
// import Live from 'layouts/pages/live';
import QA from 'layouts/pages/qa';

const routes = [
  {
    name: 'Home',
    route: '/',
    component: <Home />,
  },
  {
    name: 'championship',
    route: '/championship',
    component: <Champion />,
  },
  {
    name: 'Registration',
    route: '/Registration',
    component: <Registration />,
  },
  {
    name: 'QA',
    route: '/QA',
    component: <QA />,
  },
];
export default routes;
