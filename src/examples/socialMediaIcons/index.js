import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, styled, keyframes } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const drawLine = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const SocialMenuBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),

  '&::before, &::after': {
    content: '""',
    width: '1px',
    height: '56px',
    marginLeft: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transformOrigin: 'top',
    animation: `${drawLine} 1s ${EASING} 0.3s both`,
  },
  '&::after': {
    transformOrigin: 'bottom',
  },

  '& .MuiIconButton-root': {
    position: 'relative',
    width: 48,
    height: 48,
    padding: 0,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '999px',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: `${fadeUp} 0.8s ${EASING} both`,
    transition: `width 0.6s ${EASING}, background-color 0.4s ease,
      border-color 0.4s ease, box-shadow 0.4s ease`,
    '&:nth-of-type(1)': { animationDelay: '0.6s' },
    '&:nth-of-type(2)': { animationDelay: '0.75s' },

    '& .social-icon': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 46,
      height: 46,
    },
    '& .social-label': {
      paddingRight: theme.spacing(2.5),
      fontSize: '0.8rem',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      opacity: 0,
      transform: 'translateX(-8px)',
      transition: `opacity 0.4s ease 0.1s, transform 0.5s ${EASING} 0.1s`,
    },

    '&:hover': {
      width: 150,
      '& .social-label': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
    '&.facebook:hover': {
      backgroundColor: '#4267B2',
      borderColor: '#4267B2',
      boxShadow: '0 0 28px rgba(66, 103, 178, 0.6)',
    },
    '&.instagram:hover': {
      background:
        'linear-gradient(45deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
      borderColor: '#dc2743',
      boxShadow: '0 0 28px rgba(220, 39, 67, 0.6)',
    },
  },

  '@media (hover: none)': {
    '& .MuiIconButton-root:hover': {
      width: 48,
      '& .social-label': {
        display: 'none',
      },
    },
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiIconButton-root': {
      width: 44,
      height: 44,
      '& .social-icon': {
        width: 42,
        height: 42,
      },
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '&::before, &::after, & .MuiIconButton-root': {
      animation: 'none',
    },
  },
}));

const SocialMediaIcons = ({ sx }) => {
  return (
    <SocialMenuBox sx={sx}>
      <IconButton
        href="https://web.facebook.com/TigersTeamPlayers"
        target="_blank"
        rel="noreferrer"
        className="facebook"
        aria-label="Facebook"
      >
        <span className="social-icon">
          <FacebookIcon />
        </span>
        <span className="social-label">Facebook</span>
      </IconButton>
      <IconButton
        href="https://www.instagram.com/tigers_team_offical/"
        target="_blank"
        rel="noreferrer"
        className="instagram"
        aria-label="Instagram"
      >
        <span className="social-icon">
          <InstagramIcon />
        </span>
        <span className="social-label">Instagram</span>
      </IconButton>
    </SocialMenuBox>
  );
};

SocialMediaIcons.propTypes = {
  sx: PropTypes.object,
};

export default SocialMediaIcons;
