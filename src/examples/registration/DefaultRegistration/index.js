import React, {useState} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VideoBackgroundContainer from 'components/ThisBGVideo';
import {StyledButton} from 'components/ThisStyledButton';
import {
  Container,
  ContainerWrapper,
  SignUpContainer,
  SignInContainer,
  Form,
  Title,
  Input,
  Anchor,
  OverlayContainer,
  Overlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Paragraph,
} from './Components';

import backGroundVideo from 'assets/videos/BMW_M3_Live.mp4';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Registration() {
  const [signIn, setSignIn] = React.useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(process.env.REACT_APP_LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Login successful');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Incorrect username or password');
      }
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  return (
    <ContainerWrapper>
      <VideoBackgroundContainer videoURL={backGroundVideo} registration={true}>
        <Container>
          <SignUpContainer signingIn={signIn}>
            <Form>
              <Title>Create Account</Title>
              <Input type="text" placeholder="Full Name" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <StyledButton>Sign Up</StyledButton>
            </Form>
          </SignUpContainer>
          <SignInContainer signingIn={signIn}>
            <Form onSubmit={handleSignInSubmit}>
              <Title>Sign in</Title>
              <Input
                type="text"
                placeholder="Username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Anchor href="#">Forgot your password?</Anchor>
              <StyledButton type="submit">Sign In</StyledButton>
            </Form>
          </SignInContainer>
          <OverlayContainer signingIn={signIn}>
            <Overlay signingIn={signIn}>
              <LeftOverlayPanel signingIn={signIn}>
                <Title>Welcome Back!</Title>
                <Paragraph>
                  To keep connected with us please login with your personal info
                </Paragraph>
                <StyledButton onClick={() => setSignIn(true)}>
                  Sign In
                </StyledButton>
              </LeftOverlayPanel>
              <RightOverlayPanel signingIn={signIn}>
                <Title>Hello, Friend!</Title>
                <Paragraph>
                  Enter your personal details and start journey with us
                </Paragraph>
                <StyledButton onClick={() => setSignIn(false)}>
                  Sign Up
                </StyledButton>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
        </Container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{width: '100%'}}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </VideoBackgroundContainer>
    </ContainerWrapper>
  );
}

export default Registration;
