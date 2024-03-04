import React, {useState, useEffect} from 'react';
import routes from 'routes';

import StyledBox from 'components/ThisBox';
import DefaultNavbar from 'examples/navbars/DefaultNavbar/NBar';

function NavBar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <StyledBox
      position="absolute"
      width="100%"
      zIndex="5"
      variant="gradient"
      bgColor="dark"
      shadow="sm"
      py={0.25}
      sx={{
        opacity: showNavbar ? 1 : 0,
        transition: 'opacity 0.5s, visibility 0.5s linear 0.5s',
        visibility: showNavbar ? 'visible' : 'hidden',
      }}
    >
      <DefaultNavbar routes={routes} transparent relative light center />
    </StyledBox>
  );
}

export default NavBar;
