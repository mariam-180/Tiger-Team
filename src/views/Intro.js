import React from 'react';
import { styled } from '@mui/material/styles';
import StyledTypography from 'components/ThisTypography';
import VideoBackgroundContainer from 'components/ThisBGVideo';

import TigersTeam from 'assets/videos/TigersTeam.mp4';

import BackgroundContainer from 'components/ThisBackgroundContainer';

const StyledCard = styled('div')(({ theme }) => ({
  backdropFilter: 'blur(5px) brightness(80%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  width: '80%',
  maxWidth: '800px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    width: '80%',
  },
  [theme.breakpoints.up('md')]: {
    width: '60%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '60%',
  },
}));

const Header = () => {
  return (
    <VideoBackgroundContainer videoURL={TigersTeam}>
      <BackgroundContainer
        backgroundimage=""
        secondbackground=""
        sx={{
          justifyContent: 'end',
          alignItems: 'center',
          padding: '0',
          backdropFilter: 'blur(0px) brightness(50%)',
        }}
      >
        <StyledCard>
          <StyledTypography
            waving
            variant="h1"
            color="error"
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.2rem',
                lg: '2rem',
                xl: '3rem',
              },
              fontFamily: '"Druk Wide Web", Arial, sans-serif',
              textTransform: 'uppercase',
            }}
          >
            Tigers Team
          </StyledTypography>
          <StyledTypography
            variant="body1"
            color="white"
            sx={{
              mt: { xs: 0.5, sm: 0 },
              fontSize: {
                xs: '1.5rem',
                sm: '1.9rem',
                lg: '3rem',
                xl: '3.3rem',
              },
              fontFamily: '"Druk Wide Web", Arial, sans-serif',
              textTransform: 'uppercase',
              lineHeight: 'normal',
            }}
          >
            A Decade of Excellence in Drift Simulations
          </StyledTypography>
          <StyledTypography
            variant="body1"
            color="white"
            sx={{
              mt: { xs: 1, sm: 1.5 },
              fontSize: {
                xs: '1rem',
                sm: '1.3rem',
                lg: '1.45rem',
                xl: '1.5rem',
              },
              fontFamily: '"Druk Wide Web", Arial, sans-serif',
              lineHeight: 'normal',
            }}
          >
            Leading drift gaming innovation since 2012. Proudly based in Jordan.
          </StyledTypography>
        </StyledCard>
      </BackgroundContainer>
    </VideoBackgroundContainer>
  );
};

export default Header;
