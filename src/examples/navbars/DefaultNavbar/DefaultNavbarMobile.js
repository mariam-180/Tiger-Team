import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import MuiLink from '@mui/material/Link';
import ThisBox from 'components/ThisBox';
import ThisTypography from 'components/ThisTypography';
// eslint-disable-next-line max-len
import DefaultNavbarDropdown from 'examples/navbars/DefaultNavbar/DefaultNavbarDropdown';

const PANEL_STYLE = {
  mt: 1,
  mb: 2,
  px: { xs: 1.5, sm: 3 },
  py: 1,
  maxHeight: 'calc(100dvh - 120px)',
  overflowY: 'auto',
  backgroundColor: 'rgba(6, 7, 8, 0.92)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  '& > a': {
    minHeight: '48px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  '& > a:last-of-type': {
    borderBottom: 'none',
  },
};

const SUB_ITEM_HOVER = {
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 300ms linear',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    '& *': {
      color: '#ffffff',
    },
  },
};

function DefaultNavbarMobile({ routes, open }) {
  const [collapse, setCollapse] = useState('');

  const handleSetCollapse = (name) =>
    collapse === name ? setCollapse(false) : setCollapse(name);

  const renderNavbarItems = routes.map(
    ({
      name,
      icon,
      collapse: routeCollapses,
      href,
      route,
      collapse: navCollapse,
    }) => (
      <DefaultNavbarDropdown
        key={name}
        name={name}
        icon={icon}
        collapseStatus={name === collapse}
        onClick={() =>
          navCollapse ? handleSetCollapse(name) : handleSetCollapse(false)
        }
        href={href}
        route={route}
        collapse={Boolean(navCollapse)}
      >
        <ThisBox
          sx={{ height: '15rem', maxHeight: '15rem', overflowY: 'scroll' }}
        >
          {routeCollapses &&
            routeCollapses.map((item) => (
              <ThisBox key={item.name} px={2}>
                {item.collapse ? (
                  <>
                    <ThisTypography
                      display="block"
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                      color="white"
                      py={1}
                      px={0.5}
                    >
                      {item.name}
                    </ThisTypography>
                    {item.collapse.map((el) => (
                      <ThisTypography
                        key={el.name}
                        component={el.route ? Link : MuiLink}
                        to={el.route || ''}
                        href={el.href || ''}
                        target={el.href ? '_blank' : ''}
                        rel="noreferrer"
                        display="block"
                        variant="button"
                        color="white"
                        textTransform="capitalize"
                        fontWeight="regular"
                        py={0.625}
                        px={2}
                        sx={SUB_ITEM_HOVER}
                      >
                        {el.name}
                      </ThisTypography>
                    ))}
                  </>
                ) : (
                  <ThisBox
                    key={item.key}
                    display="block"
                    component={item.route ? Link : MuiLink}
                    to={item.route || ''}
                    href={item.href || ''}
                    target={item.href ? '_blank' : ''}
                    rel="noreferrer"
                    sx={{ ...SUB_ITEM_HOVER, py: 1, px: 1.625 }}
                  >
                    <ThisTypography
                      display="block"
                      variant="button"
                      fontWeight="bold"
                      textTransform="capitalize"
                      color="white"
                    >
                      {item.name}
                    </ThisTypography>
                    <ThisTypography
                      display="block"
                      variant="button"
                      fontWeight="regular"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 300ms linear',
                      }}
                    >
                      {item.description}
                    </ThisTypography>
                  </ThisBox>
                )}
              </ThisBox>
            ))}
        </ThisBox>
      </DefaultNavbarDropdown>
    ),
  );

  return (
    <Collapse in={Boolean(open)} timeout="auto" unmountOnExit>
      <ThisBox sx={PANEL_STYLE}>{renderNavbarItems}</ThisBox>
    </Collapse>
  );
}

DefaultNavbarMobile.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
