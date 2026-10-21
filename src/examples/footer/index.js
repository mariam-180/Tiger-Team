import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import SocialMediaIcons from 'examples/socialMediaIcons';
import logoIMG from 'assets/images/logos/logo.png';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: theme.spacing(10, 10, 4),
  color: 'rgba(255, 255, 255, 0.75)',
  background: `
    radial-gradient(circle at 0% 100%, rgba(212, 0, 0, 0.60), transparent 45%),
    #060708
  `,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 4, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 2.5, 3),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #d40000, transparent)',
    transformOrigin: 'center',
    animation: `${growLine} 1.4s ${EASING} both`,
  },
  [REDUCED_MOTION_QUERY]: {
    '&::before': {
      animation: 'none',
    },
  },
}));

const Watermark = styled('img')(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(4),
  bottom: theme.spacing(2),
  width: 'clamp(140px, 22vw, 340px)',
  opacity: 0.07,
  pointerEvents: 'none',
  userSelect: 'none',
}));

const Heading = styled(Typography)(({ theme }) => ({
  position: 'relative',
  paddingBottom: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#ffffff',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '48px',
    height: '3px',
    borderRadius: '2px',
    backgroundColor: '#d40000',
  },
}));

const ContactLink = styled('a')(({ theme }) => ({
  display: 'block',
  width: 'fit-content',
  marginBottom: theme.spacing(1.25),
  fontSize: '1rem',
  color: 'rgba(255, 255, 255, 0.85)',
  textDecoration: 'none',
  transition: `color 0.3s ease, transform 0.4s ${EASING}`,
  [HOVER_QUERY]: {
    '&:hover': {
      color: '#ffffff',
      transform: 'translateX(6px)',
    },
  },
}));

const SocialRow = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const Copyright = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(8),
  paddingTop: theme.spacing(3),
  textAlign: 'center',
  fontSize: '0.85rem',
  letterSpacing: '0.12em',
  color: 'rgba(255, 255, 255, 0.5)',
  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(5),
  },
}));

const Footer = () => {
  return (
    <Root>
      <Watermark src={logoIMG} alt="" aria-hidden="true" />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid item xs={12} md={7}>
            <Heading variant="h4" component="h3">
              About us
            </Heading>
            <Typography
              variant="subtitle1"
              sx={{ maxWidth: '640px', lineHeight: 1.8 }}
            >
              Welcome to Tigers Team, your gateway to the ultimate racing
              simulation experience. Since our inception in Jordan in 2012,
              we&apos;ve dedicated ourselves to providing affordable,
              high-quality drifting simulations. Our expert team is committed to
              enhancing your e-gaming journey with custom rigs, professional
              training, and exceptional support. Dive into the world of drifting
              with Tigers Team, where passion and innovation drive every turn.
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Heading variant="h5" component="h3">
              Contact us
            </Heading>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              Contact us if need help with anything
            </Typography>
            <ContactLink href="tel:+962797544751">(962) 797544751</ContactLink>
            <ContactLink href="mailto:info@tigers-team.com">
              info@tigers-team.com
            </ContactLink>
            <SocialRow>
              <SocialMediaIcons
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  '&::before, &::after': {
                    display: 'none',
                  },
                }}
              />
            </SocialRow>
          </Grid>
        </Grid>
        <Copyright>@ {new Date().getFullYear()} TigersTeam</Copyright>
      </Container>
    </Root>
  );
};

export default Footer;
