import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownRounded from '@mui/icons-material/KeyboardArrowDownRounded';
import ThisBox from 'components/ThisBox';
import ThisTypography from 'components/ThisTypography';
import { styled } from '@mui/material/styles';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const ArrowIcon = styled(KeyboardArrowDownRounded, {
  shouldForwardProp: (prop) => prop !== 'isopen',
})(({ isopen }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  transform: isopen ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: `transform 0.4s ${EASING}, color 0.3s ease`,
}));

const ActiveTypography = styled(ThisTypography, {
  shouldForwardProp: (prop) => prop !== 'isactive',
})({
  position: 'relative',
  textAlign: 'center',
  color: '#ffffff',
  letterSpacing: '0.06em',
  transition: 'color 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    bottom: '-6px',
    left: 0,
    height: '2px',
    backgroundColor: '#ff0000',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
    transition: `transform 0.4s ${EASING}`,
  },
});

const ActiveBox = styled(ThisBox, {
  shouldForwardProp: (prop) => prop !== 'isactive',
})(({ isactive }) => ({
  alignItems: 'center',
  cursor: 'pointer',
  color: 'inherit',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  transition: 'all 0.3s',
  '& .MuiTypography-root:first-of-type::after': {
    transform: isactive ? 'scaleX(1)' : 'scaleX(0)',
  },
  '&:hover': {
    '& .MuiTypography-root:first-of-type::after': {
      transform: 'scaleX(1)',
    },
    '& svg': {
      color: '#ffffff',
    },
  },
}));

function DefaultNavbarDropdown({
  name,
  icon,
  children,
  collapseStatus,
  light,
  href,
  route,
  collapse,
  ...rest
}) {
  const location = useLocation();
  const isactive = location.pathname === route;

  const linkComponent = {
    component: 'a',
    href,
    target: '_blank',
    rel: 'noreferrer',
  };

  const routeComponent = {
    component: Link,
    to: route,
  };

  return (
    <>
      <ActiveBox
        {...rest}
        p={1}
        display="flex"
        color={light ? 'white' : 'dark'}
        sx={{ cursor: 'pointer', userSelect: 'none' }}
        isactive={isactive ? 1 : 0}
        {...(route && routeComponent)}
        {...(href && linkComponent)}
      >
        {icon && (
          <ThisTypography
            variant="body2"
            lineHeight={1}
            color="inherit"
            sx={{ alignSelf: 'center', '& *': { verticalAlign: 'middle' } }}
          >
            {icon}
          </ThisTypography>
        )}
        <ActiveTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? 'white' : 'dark'}
          sx={{ ml: { md: 1, lg: 3 }, mr: 0.25 }}
          isactive={isactive ? 1 : 0}
        >
          {name}
        </ActiveTypography>
        {collapse && (
          <ThisTypography
            variant="body2"
            color={light ? 'white' : 'dark'}
            ml="auto"
          >
            <ArrowIcon
              isopen={collapseStatus ? 1 : 0}
              sx={{ verticalAlign: 'middle' }}
            />
          </ThisTypography>
        )}
      </ActiveBox>
      {children && (
        <Collapse in={Boolean(collapseStatus)} timeout={400} unmountOnExit>
          {children}
        </Collapse>
      )}
    </>
  );
}

DefaultNavbarDropdown.defaultProps = {
  children: false,
  collapseStatus: false,
  light: false,
  href: '',
  route: '',
};

DefaultNavbarDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  collapseStatus: PropTypes.bool,
  light: PropTypes.bool,
  href: PropTypes.string,
  route: PropTypes.string,
  collapse: PropTypes.bool.isRequired,
};

export default DefaultNavbarDropdown;
