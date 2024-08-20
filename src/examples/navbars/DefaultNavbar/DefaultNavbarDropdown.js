import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import Icon from '@mui/material/Icon';
import ThisBox from 'components/ThisBox';
import ThisTypography from 'components/ThisTypography';
import { styled } from '@mui/material/styles';

const GradientIcon = styled(Icon)`
  position: relative;
  top: 5px;
  cursor: pointer;
  background: linear-gradient(45deg, #ffffff 30%, #ff0000 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &:hover {
    background: linear-gradient(45deg, #ff0000 30%, #ffffff 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:active {
    background: linear-gradient(45deg, #ff0000 30%, #ffffff 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const ActiveTypography = styled(ThisTypography, {
  shouldForwardProp: (prop) => prop !== 'isactive',
})(({ theme }) => ({
  textAlign: 'center',
  color: '#ffffff',
  transition: 'all 0.3s ease-in-out',
  transform: 'none',
  [theme.breakpoints.down('lg')]: {
    borderRadius: '20px 0 0 20px',
  },
}));

const ActiveBox = styled(ThisBox, {
  shouldForwardProp: (prop) => prop !== 'isactive',
})(({ theme }) => ({
  mx: theme.spacing(1),
  p: theme.spacing(1),
  alignItems: 'center',
  cursor: 'pointer',
  color: 'inherit',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderRadius: '20px 20px 0 0',
  transition: 'all 0.3s',
  '&:hover': {
    // backgroundColor: theme.palette.darkGold.main,
    backgroundColor: theme.palette.darkRed.main,
  },
  [theme.breakpoints.down('lg')]: {
    borderRadius: '20px 0 0 20px',
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
          sx={{ fontWeight: '100%', ml: { md: 1, lg: 3 }, mr: 0.25 }}
          isactive={isactive ? 1 : 0}
        >
          {name}
        </ActiveTypography>
        <ThisTypography
          variant="body2"
          color={light ? 'white' : 'dark'}
          ml="auto"
        >
          <GradientIcon
            sx={{
              fontWeight: 'normal',
              verticalAlign: 'middle',
              color: '#d4af37',
            }}
          >
            {collapse && 'keyboard_arrow_down'}
          </GradientIcon>
        </ThisTypography>
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
