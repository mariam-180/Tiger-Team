import React from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton, styled } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const SocialMenuBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& .MuiIconButton-root': {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: '#C0C0C0',
    color: '#000',
    boxShadow: '0 5px 4px rgba(0,0,0,.5)',
    transition: `transform 0.5s ease-in-out,
    background-color 0.3s ease-in-out`,
    '&:hover': {
      backgroundColor: '#E4405F',
      color: '#fff',
      transform: 'translateY(-15%)',
    },
  },
  '& .MuiIconButton-root:hover': {
    '&.github': { backgroundColor: 'rgba(0, 0, 0, 0.829)' },
    '&.linkedin': { backgroundColor: '#0077b5' },
    '&.code': { backgroundColor: '#000' },
    '&.facebook': { backgroundColor: '#4267B2' },
  },
}));

const SocialMediaIcons = ({ sx }) => {
  return (
    <SocialMenuBox sx={sx}>
      <IconButton
        href="https://web.facebook.com/TigersTeamPlayers"
        target="_blank"
        className="facebook"
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        href="https://www.instagram.com/tigers_team_offical/"
        target="_blank"
        className="instagram"
      >
        <InstagramIcon />
      </IconButton>
    </SocialMenuBox>
  );
};

SocialMediaIcons.propTypes = {
  sx: PropTypes.object,
};

export default SocialMediaIcons;
