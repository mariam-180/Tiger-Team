import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { StyledButton } from 'components/ThisStyledButton';

const VerificationPopup = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          An email has been sent to your email address. Please check your email
          to verify your account. If you do not see the email, please check your
          spam folder and mark the email as not spam.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          OK
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

VerificationPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VerificationPopup;
