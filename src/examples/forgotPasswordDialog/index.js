import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';

import { useSnackbar } from 'context/SnackbarContext';

const StyledButton = styled(Button)({
  backgroundColor: '#35465c',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
  padding: '10px 20px',
  borderRadius: '5px',
  marginTop: '20px',
});

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const { showSnackbar } = useSnackbar();

  const handleResetPassword = async () => {
    try {
      await axios.post(process.env.REACT_APP_REQUEST_RESET_PASSWORD, { email });
      showSnackbar(
        'A password reset link has been sent to your email address.',
        'success',
      );
      onClose();
    } catch (error) {
      showSnackbar('Failed to send reset email. Please try again.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Enter your email address below and you will receive a link to reset
          your password.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleResetPassword} color="primary">
          Reset
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

ForgotPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordDialog;
