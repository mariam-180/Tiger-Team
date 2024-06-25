import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { validateForm } from 'utils/formValidation';

const StyledRegisterButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #000000 0%, #A50000 90%)',
  color: '#ffffff',
  padding: theme.spacing(1.5, 4),
  fontSize: '.9rem',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  borderRadius: '25px',
  transition: 'background 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #000000 0%, #A50000 90%)',
    boxShadow: '0 5px 7px 2px rgba(255, 105, 135, .4)',
  },
}));

const StyledCancelButton = styled(Button)({
  color: '#A50000',
  border: '1px solid #A50000',
  backgroundColor: 'transparent',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '0.875rem',
  padding: '8px 24px',
  borderRadius: '25px',
  boxShadow: 'none',
  '&:hover': {
    color: '#000000',
    border: '1px solid #000000',
    boxShadow: 'none',
  },
});

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    padding: theme.spacing(2),
    backgroundColor: '#D3D3D3',
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#A50000',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#A50000',
      },
    },
    marginBottom: theme.spacing(2),
  },
  paymentNote: {
    color: '#A50000',
    fontSize: '0.65rem',
    padding: theme.spacing(2),
  },
}));

const RegistrationFormDialog = ({
  open,
  handleClose,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}) => {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationResult = validateForm(formData);
    if (validationResult.email === 'Invalid') {
      setSnackbarMessage('Error: Unable to register; Invalid email!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    if (validationResult.phone === 'Invalid') {
      setSnackbarMessage('Error: Unable to register; Invalid phone number!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    formData.email = validationResult.email;
    formData.phone_number = validationResult.phone;
    try {
      const response = await fetch(
        process.env.REACT_APP_REGISTRATION_FORM_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        setSnackbarMessage('Registered successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleClose();
      } else if (response.status == 409) {
        setSnackbarMessage(`Error: Unable to register; Already registered!`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(
          `Error: Unable to register, Please contact administration`,
        );
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(`Error: Unable to register; ${error}.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        className: classes.dialogPaper,
      }}
    >
      <DialogTitle color="#A50000" fontSize="1.2rem">
        Registration
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText paddingBottom={2}>
            To register for the event, please enter your name, email, and phone
            number here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="first_name"
            label="First Name"
            type="text"
            fullWidth
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            variant="outlined"
            className={classes.inputField}
          />
          <TextField
            autoFocus
            margin="dense"
            id="last_name"
            label="Last Name"
            type="text"
            fullWidth
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            variant="outlined"
            className={classes.inputField}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email Address"
            type="text"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            variant="outlined"
            className={classes.inputField}
          />
          <TextField
            margin="dense"
            id="phone_number"
            label="Phone Number"
            type="tel"
            fullWidth
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            variant="outlined"
            className={classes.inputField}
          />
        </DialogContent>
        <DialogActions>
          <StyledCancelButton onClick={handleClose}>Cancel</StyledCancelButton>
          <StyledRegisterButton onClick={handleClose} type="submit">
            Submit
          </StyledRegisterButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

RegistrationFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setSnackbarOpen: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  setSnackbarSeverity: PropTypes.func.isRequired,
};

export default RegistrationFormDialog;
