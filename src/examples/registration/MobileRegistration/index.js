import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from 'authContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {Grid, Container} from '@mui/material';
import {styled} from '@mui/material/styles';

import {
  SignInContainer,
  SignUpContainer,
  Form,
  Input,
  RowInput,
  Anchor,
  Button,
  Row,
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AuthPage() {
  const [signIn, setSignIn] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const {login} = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const toggleAuthMode = () => {
    setUsername('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setEmail('');
    setSignIn(!signIn);
  };

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

      const responseData = await response.json();

      if (response.ok) {
        const accessToken = responseData.access_token;
        login(accessToken);
        navigate(redirect);
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

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const signUpData = {
      user_name: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      password: password,
    };

    try {
      const response = await fetch(process.env.REACT_APP_USERS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Sign-up successful');
      } else {
        const errorData = await response.json();
        setSnackbarSeverity('error');
        setSnackbarMessage(errorData.message || 'Sign-up failed');
      }
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('An error occurred during sign-up');
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
              <Form onSubmit={handleSignUpSubmit}>
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Row>
                  <RowInput
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <RowInput
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Row>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Sign Up</Button>
              </Form>
            </SignUpContainer>
            <SignInContainer signingin={signIn}>
              <Form onSubmit={handleSignInSubmit}>
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
                <Button type="submit">Sign In</Button>
              </Form>
            </SignInContainer>
          </OverlayContainerContent>
        </OverlayContainer>
      </ThisContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="standard"
          sx={{width: '100%'}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default AuthPage;
