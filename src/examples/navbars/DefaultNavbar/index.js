import React, { useState, useEffect } from 'react';
import { keyframes } from '@mui/material/styles';
import { getRoutesList } from 'routes';

import { useAuth } from 'authContext';
import filterRoutesByRole from 'utils/FilterRoutesByRole';

import StyledBox from 'components/ThisBox';
import DefaultNavbar from 'examples/navbars/DefaultNavbar/NBar';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

function NavBar() {
  const routes = getRoutesList();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const { userRole } = useAuth();

  const filteredRoutes = filterRoutesByRole(routes, userRole);

  return (
    <StyledBox
      position="absolute"
      width="100%"
      zIndex="5"
      py={0.75}
      sx={{
        background:
          'linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0))',
        boxShadow: 'none',
        opacity: showNavbar ? 1 : 0,
        transition: 'opacity 0.5s, visibility 0.5s linear 0.5s',
        visibility: showNavbar ? 'visible' : 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          bottom: 0,
          left: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.55), transparent)',
          transformOrigin: 'center',
          animation: `${growLine} 1.4s ${EASING} 0.3s both`,
        },
      }}
    >
      <DefaultNavbar
        routes={filteredRoutes}
        transparent
        relative
        light
        center
      />
    </StyledBox>
  );
}

export default NavBar;
