import React, {useState} from 'react';
import {Grid, Container} from '@mui/material';
import {styled} from '@mui/material/styles';

import {
  SignInContainer,
  SignUpContainer,
  Form,
  Input,
  Anchor,
  Button,
} from './Components';

import ThisContainer from 'components/ThisContainer';
import LoginSignupToggle from 'components/ThisCircle';
import background from 'assets/images/backGround/BMW_M3.png';

const OverlayContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backdropFilter: 'blur(5px)',
  zIndex: 1,
});

const OverlayContainerContent = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60vh',
  zIndex: 1,
});

const OverlayContainerToggle = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '20vh',
  top: '20px',
  zIndex: 2,
});

function AuthPage() {
  const [signIn, setSignIn] = useState(true);

  const toggleAuthMode = () => setSignIn(!signIn);

  return (
    <Grid
      container
      direction="column"
      height="100vh"
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
      <ThisContainer background={background} noLogo={true}>
        <OverlayContainer>
          <OverlayContainerToggle>
            <LoginSignupToggle
              isChecked={!signIn}
              handleToggle={toggleAuthMode}
            ></LoginSignupToggle>
          </OverlayContainerToggle>
          <OverlayContainerContent>
            <SignUpContainer signingin={signIn}>
              <Form>
                <Input type="text" placeholder="Full Name" />
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Password" />
                <Button>Sign Up</Button>
              </Form>
            </SignUpContainer>
            <SignInContainer signingin={signIn}>
              <Form>
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Password" />
                <Anchor href="#">Forgot your password?</Anchor>
                <Button>Sign In</Button>
              </Form>
            </SignInContainer>
          </OverlayContainerContent>
        </OverlayContainer>
      </ThisContainer>
    </Grid>
  );
}

export default AuthPage;
