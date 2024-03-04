import React from 'react';
import {styled} from '@mui/material/styles';
import StyledTypography from 'components/ThisTypography';

import tigersTeamImage from 'assets/images/backGround/tigersTeam.png';

import StyledContainer from 'components/ThisContainer';

const StyledCard = styled('div')(({theme}) => ({
  // backgroundColor: "rgba(255, 255, 255, 0.2)",
  backdropFilter: 'blur(5px) brightness(80%)',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  width: '80%', // Set it to 100% to make it fluid
  maxWidth: '800px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto', // Center horizontally
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),

  [theme.breakpoints.up('sm')]: {
    width: '80%', // Adjust width for small screens and above
  },
  [theme.breakpoints.up('md')]: {
    width: '60%', // Adjust width for medium screens and above
  },
  [theme.breakpoints.up('lg')]: {
    width: '60%', // Adjust width for large screens and above
  },
}));

const Header = () => {
  return (
    <StyledContainer
      background={tigersTeamImage}
      sx={{
        justifyContent: 'end',
        padding: '0',
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
              // md: "2.5rem",
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
            mt: {xs: 0.5, sm: 0},
            fontSize: {
              xs: '1.5rem',
              sm: '1.9rem',
              // md: "2.5rem",
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
            mt: {xs: 1, sm: 1.5},
            fontSize: {
              xs: '1rem',
              sm: '1.3rem',
              // md: "1.4rem",
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
    </StyledContainer>
  );
};

export default Header;
