import React from 'react';
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

function Registration() {
  const [signIn, setSignIn] = React.useState(true);

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
            <Form>
              <Title>Sign in</Title>
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Anchor href="#">Forgot your password?</Anchor>
              <StyledButton>Sign In</StyledButton>
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
      </VideoBackgroundContainer>
    </ContainerWrapper>
  );
}

export default Registration;
