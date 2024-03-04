import React, {useState} from 'react';
import {Typography, Box, Button, Snackbar, Alert} from '@mui/material';
import {styled} from '@mui/material/styles';
import RegistrationFormDialog from 'examples/formSubmit';

const FlexContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0px -24px',
});

const Title = styled(Typography)(({theme}) => ({
  color: '#FFFFFF',
  fontSize: '48px',
  margin: '90px 0px 24px',
  [theme.breakpoints.down('md')]: {
    fontSize: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '0px 0px 0px',
    padding: '30px',
  },
}));

const Subtitle = styled(Typography)(({theme}) => ({
  color: '#FFFFFF',
  fontSize: '32px',
  margin: '0px 0px 24px',
  [theme.breakpoints.down('md')]: {
    fontSize: '26px',
  },
  [theme.breakpoints.down('sm')]: {
    margin: '-25px 0px 0px',
    padding: '15px',
  },
}));

const BodyText = styled(Typography)(({theme}) => ({
  color: '#A5A5A5',
  fontFamily: '"Nunito", sans-serif',
  fontSize: '16px',
  margin: '0px 0px 24px',
  [theme.breakpoints.down('sm')]: {
    margin: '-25px 0px 20px',
    padding: '20px',
  },
}));
// eslint-disable-next-line no-unused-vars
const StyledRegisterButton = styled(Button)(({theme}) => ({
  'background': 'linear-gradient(45deg, #000000 30%, #FF0000 90%)',
  'color': '#ffffff',
  'padding': theme.spacing(1.5, 4),
  'fontSize': '1rem',
  'fontWeight': 600,
  'textTransform': 'none',
  'boxShadow': '0 3px 5px 2px rgba(255, 105, 135, .3)',
  'borderRadius': '25px',
  'transition': 'background 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #333333 30%, #666666 90%)',
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .4)',
  },
}));

const ClosedRegistrationMessage = styled(Typography)(({theme}) => ({
  color: '#A50000',
  width: '80%',
  fontFamily: '"Nunito", sans-serif',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px auto',
  textAlign: 'center',
  padding: theme.spacing(2),
  background: 'rgba(200, 200, 200, 0.5)',
  borderRadius: '15px',
  boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '16px',
    padding: theme.spacing(1.5),
    margin: '15px 0px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '14px',
    padding: theme.spacing(1),
    margin: '10px 0px',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '18px',
    padding: theme.spacing(2.5),
    margin: '25px 0px',
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '20px',
    padding: theme.spacing(3),
    margin: '30px 0px',
  },
}));

const WelcomingEventPage = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // eslint-disable-next-line no-unused-vars
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FlexContainer>
      <Title
        variant="h1"
        gutterBottom
        textAlign="center"
        maxWidth="550px"
        textTransform="uppercase"
      >
        Tigers Team Champion League
      </Title>
      <Subtitle
        variant="h2"
        gutterBottom
        textAlign="center"
        maxWidth="450px"
        textTransform="uppercase"
      >
        Gear Up for the Tigers Team Racing League
      </Subtitle>
      <BodyText
        variant="body1"
        gutterBottom
        textAlign="center"
        maxWidth="440px"
      >
        Experience racing like never before. Start your engines, join now!
      </BodyText>
      {/* <StyledRegisterButton variant="contained" size="large"
        onClick={handleClickOpen}>
        Register Now
      </StyledRegisterButton> */}
      <ClosedRegistrationMessage>
        Registration is now closed. See you at the event!
      </ClosedRegistrationMessage>
      <RegistrationFormDialog
        open={open}
        handleClose={handleClose}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
        setSnackbarSeverity={setSnackbarSeverity}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        sx={{
          '& .MuiSnackbar-root': {
            bottom: 0,
            left: 0,
            right: 0,
          },
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{width: '100%'}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </FlexContainer>
  );
};

export default WelcomingEventPage;
