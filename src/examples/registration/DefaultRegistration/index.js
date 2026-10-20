import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from 'authContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Icon from '@mui/material/Icon';
import VideoBackgroundContainer from 'components/ThisBGVideo';
import ForgotPasswordDialog from 'examples/forgotPasswordDialog';
import ThisBox from 'components/ThisBox';
import { StyledButton } from 'components/ThisStyledButton';

import {
  Container,
  ContainerWrapper,
  SignUpContainer,
  SignInContainer,
  Form,
  Title,
  Input,
  RowInput,
  Anchor,
  OverlayContainer,
  Overlay,
  LeftOverlayPanel,
  RightOverlayPanel,
  Paragraph,
  Row,
} from './Components';

import { validateForm } from 'utils/formValidation';
import VerificationPopup from '../VerificationPopup';

import backGroundVideo from 'assets/images/backGround/BMW_M3.png';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Registration() {
  const [signIn, setSignIn] = useState(true);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    return () => {
      setSnackbarOpen(false);
    };
  }, []);

  const handleClosePopup = () => {
    setPopupOpen(false);
    navigate('/');
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
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
      } else if (response.status === 403) {
        setSnackbarSeverity('warning');
        setSnackbarMessage('Please verify your account.');
        setPopupOpen(true);
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

    const { email: validatedEmail, phone: validatedPhone } =
      validateForm(signUpData);

    if (validatedEmail === 'Invalid') {
      setSnackbarMessage('Error: Unable to register; Invalid email!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (validatedPhone === 'Invalid') {
      setSnackbarMessage('Error: Unable to register; Invalid phone number!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

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
        setPopupOpen(true);
      } else {
        const errorData = await response.json();
        let errorMessage = 'Sign-up failed';

        if (errorData.failure_detail) {
          errorMessage = errorData.failure_detail;
          if (errorData.field) {
            switch (errorData.field) {
              case 'user_name':
                errorMessage = 'Username already exists';
                break;
              case 'phone_number':
                errorMessage = 'Phone number already exists';
                break;
              case 'email':
                errorMessage = 'Email already exists';
                break;
              default:
                break;
            }
          }
        }
        setSnackbarSeverity('error');
        setSnackbarMessage(errorMessage);
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
    <ContainerWrapper>
      <VideoBackgroundContainer videoURL={backGroundVideo} registration={true}>
        <Container>
          <SignUpContainer signingin={signIn}>
            <Form onSubmit={handleSignUpSubmit}>
              <Title>Create Account</Title>
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
              <ThisBox position="relative" display="inline-block" width="100%">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Icon>{showPassword ? 'visibility_off' : 'visibility'}</Icon>
                </button>
              </ThisBox>
              <StyledButton type="submit">Sign Up</StyledButton>
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
              <ThisBox position="relative" display="inline-block" width="100%">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                />
                <button
                  onClick={togglePasswordVisibility}
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Icon>{showPassword ? 'visibility_off' : 'visibility'}</Icon>
                </button>
              </ThisBox>
              <Anchor href="#" onClick={handleOpenDialog}>
                Forgot your password?
              </Anchor>
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
                <StyledButton
                  onClick={() => {
                    setUsername('');
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    setPhoneNumber('');
                    setEmail('');
                    setSignIn(true);
                  }}
                >
                  Sign In
                </StyledButton>
              </LeftOverlayPanel>
              <RightOverlayPanel signingIn={signIn}>
                <Title>Hello, Friend!</Title>
                <Paragraph>
                  Enter your personal details and start journey with us
                </Paragraph>
                <StyledButton
                  onClick={() => {
                    setUsername('');
                    setPassword('');
                    setSignIn(false);
                  }}
                >
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
            variant="standard"
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <ForgotPasswordDialog open={open} onClose={handleCloseDialog} />
        <VerificationPopup open={popupOpen} onClose={handleClosePopup} />
      </VideoBackgroundContainer>
    </ContainerWrapper>
  );
}

export default Registration;
