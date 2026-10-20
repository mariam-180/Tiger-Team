/* eslint-disable max-len */
import React, { Fragment, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import { Link } from 'react-router-dom';
import { useAuth } from 'authContext';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import ArrowDropUpRounded from '@mui/icons-material/ArrowDropUpRounded';
import KeyboardArrowRightRounded from '@mui/icons-material/KeyboardArrowRightRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import LoginRounded from '@mui/icons-material/LoginRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';

import ThisBox from 'components/ThisBox';
import CUTypography from 'components/ThisTypography';
import ThisButton from 'components/ThisButton';

import DefaultNavbarDropdown from 'examples/navbars/DefaultNavbar/DefaultNavbarDropdown';
import DefaultNavbarMobile from 'examples/navbars/DefaultNavbar/DefaultNavbarMobile';

import breakpoints from 'assets/theme/base/breakpoints';
import logoImage from 'assets/images/logos/logo.png';

const LogoImage = styled('img')({
  display: 'block',
  height: '40px',
  width: 'auto',
  transform: 'scale(3)',
  transformOrigin: 'left center',
  transition: `transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.6s ease`,
  '&:hover': {
    transform: 'scale(3.3)',
    animation: 'logoFocus 0.7s ease-out both',
  },
  '@keyframes logoFocus': {
    '0%': { filter: 'blur(0px)' },
    '35%': { filter: 'blur(3px)' },
    '100%': { filter: 'blur(0px)' },
  },
  '@media (max-width: 600px)': {
    height: '32px',
    transform: 'scale(2.4)',
    '&:hover': {
      transform: 'scale(2.4)',
    },
  },
});

const AUTH_BUTTON_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 20px',
  color: '#ffffff',
  fontSize: '0.85rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textDecoration: 'none',
  textTransform: 'uppercase',
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.35)',
  borderRadius: '999px',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition:
    'background-color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
  '& svg': {
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    backgroundColor: '#d40000',
    borderColor: '#d40000',
    transform: 'translateY(-2px)',
    '& svg': {
      transform: 'translateX(3px)',
    },
  },
  '@media (max-width: 600px)': {
    padding: '8px 12px',
    '& span': {
      display: 'none',
    },
  },
};

const AuthLink = styled(Link)(AUTH_BUTTON_STYLE);
const AuthButton = styled('button')(AUTH_BUTTON_STYLE);

function DefaultNavbar({
  brand,
  routes,
  transparent,
  light,
  action,
  sticky,
  relative,
  center,
}) {
  const [dropdown, setDropdown] = useState('');
  const [dropdownEl, setDropdownEl] = useState('');
  const [dropdownName, setDropdownName] = useState('');
  const [nestedDropdown, setNestedDropdown] = useState('');
  const [nestedDropdownEl, setNestedDropdownEl] = useState('');
  const [nestedDropdownName, setNestedDropdownName] = useState('');
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  const { tokenValid, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  routes = routes.filter((route) => route.name !== 'Registration');

  useEffect(() => {
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    window.addEventListener('resize', displayMobileNavbar);

    displayMobileNavbar();

    return () => window.removeEventListener('resize', displayMobileNavbar);
  }, []);

  const renderNavbarItems = routes.map(
    ({ name, icon, href, route, collapse }) => (
      <DefaultNavbarDropdown
        key={name}
        name={name}
        icon={icon}
        href={href}
        route={route}
        collapse={Boolean(collapse)}
        onMouseEnter={({ currentTarget }) => {
          if (collapse) {
            setDropdown(currentTarget);
            setDropdownEl(currentTarget);
            setDropdownName(name);
          }
        }}
        onMouseLeave={() => collapse && setDropdown(null)}
        light={light}
      />
    ),
  );

  const renderRoutes = routes.map(
    ({ name, collapse, columns, rowsPerColumn }) => {
      let template;

      if (collapse && columns && name === dropdownName) {
        const calculateColumns = collapse.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / rowsPerColumn);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }

          resultArray[chunkIndex].push(item);

          return resultArray;
        }, []);

        template = (
          <Grid key={name} container spacing={3} py={1} px={1.5}>
            {calculateColumns.map((cols, key) => {
              const gridKey = `grid-${key}`;
              const dividerKey = `divider-${key}`;

              return (
                <Grid
                  key={gridKey}
                  item
                  xs={12 / columns}
                  sx={{ position: 'relative' }}
                >
                  {cols.map((col, index) => (
                    <Fragment key={col.name}>
                      <CUTypography
                        display="block"
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                        py={1}
                        px={0.5}
                        mt={index !== 0 ? 2 : 0}
                      >
                        {col.name}
                      </CUTypography>
                      {col.collapse.map((item) => (
                        <CUTypography
                          key={item.name}
                          component={item.route ? Link : MuiLink}
                          to={item.route ? item.route : ''}
                          href={
                            item.href ? item.href : (e) => e.preventDefault()
                          }
                          target={item.href ? '_blank' : ''}
                          rel={item.href ? 'noreferrer' : 'noreferrer'}
                          minWidth="11.25rem"
                          display="block"
                          variant="button"
                          color="text"
                          textTransform="capitalize"
                          fontWeight="regular"
                          py={0.625}
                          px={2}
                          sx={({
                            palette: { grey, dark },
                            borders: { borderRadius },
                          }) => ({
                            borderRadius: borderRadius.md,
                            cursor: 'pointer',
                            transition: 'all 300ms linear',

                            '&:hover': {
                              backgroundColor: grey[200],
                              color: dark.main,
                            },
                          })}
                        >
                          {item.name}
                        </CUTypography>
                      ))}
                    </Fragment>
                  ))}
                  {key !== 0 && (
                    <Divider
                      key={dividerKey}
                      orientation="vertical"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '-4px',
                        transform: 'translateY(-45%)',
                        height: '90%',
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        );
      } else if (collapse && name === dropdownName) {
        template = collapse.map((item) => {
          const linkComponent = {
            component: MuiLink,
            href: item.href,
            target: '_blank',
            rel: 'noreferrer',
          };

          const routeComponent = {
            component: Link,
            to: item.route,
          };

          return (
            <CUTypography
              key={item.name}
              {...(item.route ? routeComponent : linkComponent)}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              variant="button"
              textTransform="capitalize"
              minWidth={item.description ? '14rem' : '12rem'}
              color={item.description ? 'dark' : 'text'}
              fontWeight={item.description ? 'bold' : 'regular'}
              py={item.description ? 1 : 0.625}
              px={2}
              sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                borderRadius: borderRadius.md,
                cursor: 'pointer',
                transition: 'all 300ms linear',

                '&:hover': {
                  backgroundColor: grey[200],
                  color: dark.main,

                  '& *': {
                    color: dark.main,
                  },
                },
              })}
              onMouseEnter={({ currentTarget }) => {
                if (item.dropdown) {
                  setNestedDropdown(currentTarget);
                  setNestedDropdownEl(currentTarget);
                  setNestedDropdownName(item.name);
                }
              }}
              onMouseLeave={() => {
                if (item.dropdown) {
                  setNestedDropdown(null);
                }
              }}
            >
              {item.description ? (
                <ThisBox>
                  {item.name}
                  <CUTypography
                    display="block"
                    variant="button"
                    color="text"
                    fontWeight="regular"
                    sx={{ transition: 'all 300ms linear' }}
                  >
                    {item.description}
                  </CUTypography>
                </ThisBox>
              ) : (
                item.name
              )}
              {item.collapse && (
                <KeyboardArrowRightRounded
                  fontSize="small"
                  sx={{
                    fontWeight: 'normal',
                    verticalAlign: 'middle',
                    mr: -0.5,
                  }}
                />
              )}
            </CUTypography>
          );
        });
      }

      return template;
    },
  );

  const dropdownMenu = (
    <Popper
      anchorEl={dropdown}
      popperRef={null}
      open={Boolean(dropdown)}
      placement="top-start"
      transition
      style={{ zIndex: 10 }}
      modifiers={[
        {
          name: 'arrow',
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
      onMouseEnter={() => setDropdown(dropdownEl)}
      onMouseLeave={() => {
        if (!nestedDropdown) {
          setDropdown(null);
          setDropdownName('');
        }
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: 'left top',
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <ThisBox borderRadius="lg">
            <CUTypography variant="h1" color="white">
              <ArrowDropUpRounded ref={setArrowRef} sx={{ mt: -3 }} />
            </CUTypography>
            <ThisBox shadow="lg" borderRadius="lg" p={2} mt={2}>
              {renderRoutes}
            </ThisBox>
          </ThisBox>
        </Grow>
      )}
    </Popper>
  );

  const renderNestedRoutes = routes.map(({ collapse, columns }) =>
    collapse && !columns
      ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
          let template;

          if (parentName === nestedDropdownName) {
            template =
              nestedCollapse &&
              nestedCollapse.map((item) => {
                const linkComponent = {
                  component: MuiLink,
                  href: item.href,
                  target: '_blank',
                  rel: 'noreferrer',
                };

                const routeComponent = {
                  component: Link,
                  to: item.route,
                };

                return (
                  <CUTypography
                    key={item.name}
                    {...(item.route ? routeComponent : linkComponent)}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    variant="button"
                    textTransform="capitalize"
                    minWidth={item.description ? '14rem' : '12rem'}
                    color={item.description ? 'dark' : 'text'}
                    fontWeight={item.description ? 'bold' : 'regular'}
                    py={item.description ? 1 : 0.625}
                    px={2}
                    sx={({
                      palette: { grey, dark },
                      borders: { borderRadius },
                    }) => ({
                      borderRadius: borderRadius.md,
                      cursor: 'pointer',
                      transition: 'all 300ms linear',

                      '&:hover': {
                        backgroundColor: grey[200],
                        color: dark.main,

                        '& *': {
                          color: dark.main,
                        },
                      },
                    })}
                  >
                    {item.description ? (
                      <ThisBox>
                        {item.name}
                        <CUTypography
                          display="block"
                          variant="button"
                          color="text"
                          fontWeight="regular"
                          sx={{ transition: 'all 300ms linear' }}
                        >
                          {item.description}
                        </CUTypography>
                      </ThisBox>
                    ) : (
                      item.name
                    )}
                    {item.collapse && (
                      <KeyboardArrowRightRounded
                        fontSize="small"
                        sx={{
                          fontWeight: 'normal',
                          verticalAlign: 'middle',
                          mr: -0.5,
                        }}
                      />
                    )}
                  </CUTypography>
                );
              });
          }

          return template;
        })
      : null,
  );

  const nestedDropdownMenu = (
    <Popper
      anchorEl={nestedDropdown}
      popperRef={null}
      open={Boolean(nestedDropdown)}
      placement="right-start"
      transition
      style={{ zIndex: 10 }}
      onMouseEnter={() => {
        setNestedDropdown(nestedDropdownEl);
      }}
      onMouseLeave={() => {
        setNestedDropdown(null);
        setNestedDropdownName('');
        setDropdown(null);
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: 'left top',
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <ThisBox ml={2.5} mt={-2.5} borderRadius="lg">
            <ThisBox shadow="lg" borderRadius="lg" py={1.5} px={1} mt={2}>
              {renderNestedRoutes}
            </ThisBox>
          </ThisBox>
        </Grow>
      )}
    </Popper>
  );

  return (
    <Container sx={sticky ? { position: 'sticky', top: 0, zIndex: 10 } : null}>
      <ThisBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={relative ? 0 : 2}
        mx={relative ? 0 : 3}
        width={relative ? '100%' : 'calc(100% - 48px)'}
        borderRadius="xl"
        shadow={transparent ? 'none' : 'md'}
        color={light ? 'white' : 'dark'}
        position={relative ? 'relative' : 'absolute'}
        left={0}
        zIndex={3}
        sx={({
          palette: { transparent: transparentColor, white },
          functions: { rgba },
        }) => ({
          backgroundColor: transparent
            ? transparentColor.main
            : rgba(white.main, 0.8),
          backdropFilter: transparent ? 'none' : `saturate(200%) blur(30px)`,
        })}
      >
        <ThisBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <ThisBox
            component={Link}
            to="/"
            lineHeight={1}
            py={transparent ? 1.5 : 0.75}
            pl={relative || transparent ? 0 : { xs: 0, lg: 1 }}
          >
            <LogoImage src={logoImage} alt={brand} />
          </ThisBox>
          <ThisBox
            color="inherit"
            display={{ xs: 'none', lg: 'flex' }}
            ml="auto"
            mr={center ? 'auto' : 0}
          >
            {renderNavbarItems}
          </ThisBox>
          <ThisBox ml={{ xs: 'auto', lg: 0 }}>
            {action &&
              (action.type === 'internal' ? (
                <ThisButton
                  component={Link}
                  to={action.route}
                  variant={
                    action.color === 'white' || action.color === 'default'
                      ? 'contained'
                      : 'gradient'
                  }
                  color={action.color ? action.color : 'info'}
                  size="small"
                >
                  {action.label}
                </ThisButton>
              ) : (
                <ThisButton
                  component="a"
                  href={action.route}
                  target="_blank"
                  rel="noreferrer"
                  variant={
                    action.color === 'white' || action.color === 'default'
                      ? 'contained'
                      : 'gradient'
                  }
                  color={action.color ? action.color : 'info'}
                  size="small"
                >
                  {action.label}
                </ThisButton>
              ))}
            <ThisBox
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              {!tokenValid ? (
                <AuthLink to="/Registration" aria-label="Open registration">
                  <LoginRounded fontSize="small" />
                  <span>Sign In</span>
                </AuthLink>
              ) : (
                <AuthButton type="button" onClick={handleLogout}>
                  <LogoutRounded fontSize="small" />
                  <span>Log Out</span>
                </AuthButton>
              )}
            </ThisBox>
          </ThisBox>
          <ThisBox
            component="button"
            type="button"
            aria-label={
              mobileNavbar ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={mobileNavbar}
            display={{ xs: 'inline-block', lg: 'none' }}
            lineHeight={0}
            color={transparent ? 'white' : 'inherit'}
            sx={{
              cursor: 'pointer',
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              borderRadius: '50%',
              p: 1.25,
              ml: 0.5,
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              },
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.6)',
                outlineOffset: '2px',
              },
            }}
            onClick={openMobileNavbar}
          >
            {mobileNavbar ? <CloseRounded /> : <MenuRounded />}
          </ThisBox>
        </ThisBox>
        <ThisBox
          bgColor={transparent ? 'transparent' : 'transparent'}
          shadow={transparent ? 'lg' : 'none'}
          borderRadius="xl"
          px={transparent ? 2 : 0}
        >
          {mobileView && (
            <DefaultNavbarMobile routes={routes} open={mobileNavbar} />
          )}
        </ThisBox>
      </ThisBox>
      {dropdownMenu}
      {nestedDropdownMenu}
    </Container>
  );
}

DefaultNavbar.defaultProps = {
  brand: 'TigersTeam',
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
};

DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(['external', 'internal']).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        'primary',
        'secondary',
        'info',
        'success',
        'warning',
        'error',
        'dark',
        'light',
        'default',
        'white',
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
};

export default DefaultNavbar;
