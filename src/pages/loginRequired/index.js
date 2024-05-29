import React from 'react';
import {Typography, Grid} from '@mui/material';
import {useLocation, useNavigate} from 'react-router-dom';
import ParentContainer from 'components/ThisContainer/filtered';
import TransparentBox from 'components/ThisTransparentBox';
import {StyledButton} from 'components/ThisStyledButton';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_7.webp';

const LoginRequiredPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from =
    location.state?.from?.pathname + location.state?.from?.search || '/';
  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
          functions: {linearGradient, rgba},
          palette: {gradients},
        }) =>
          `${linearGradient(
              rgba(gradients.dark.main, 0.01),
              rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <ParentContainer
        backgroundImage={backgroundImage}
        blur="4"
        brightness="50"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <TransparentBox
          sx={{
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 3,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{color: '#6666FF', fontWeight: 'bold', mb: 2}}
          >
            Please login to continue
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{color: 'lightgray', mb: 4}}
          >
            This feature requires you to be logged in.
          </Typography>
          <StyledButton
            sx={{
              'background': '#FF3B3F',
              'color': 'white',
              '&:hover': {
                backgroundColor: '#FF1F22',
              },
            }}
            onClick={() => {
              navigate(`/Registration?redirect=${encodeURIComponent(from)}`);
            }}
          >
            Log In
          </StyledButton>
          <StyledButton
            sx={{
              'background': '#222222',
              'color': 'white',
              'marginLeft': '20px',
              '&:hover': {
                backgroundColor: '#000000',
              },
            }}
            onClick={() => {
              navigate(`/`);
            }}
          >
            Home
          </StyledButton>
        </TransparentBox>
      </ParentContainer>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
    </Grid>
  );
};

export default LoginRequiredPage;
