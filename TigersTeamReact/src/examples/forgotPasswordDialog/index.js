import React, { useRef, useState } from 'react';
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
  Alert,
  Box,
} from '@mui/material';
import { buttonSx, panelSx } from 'examples/design/RacingUI';
import { apiErrorMessage } from 'utils/authData.mjs';

export default function ForgotPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="reset-request-title"
      PaperProps={{ sx: { ...panelSx, p: 1, backgroundImage: 'none' } }}
    >
      <Box
        component="form"
        onSubmit={async (event) => {
          event.preventDefault();
          if (submitting.current) return;
          submitting.current = true;
          setPending(true);
          setMessage('');
          try {
            const response = await axios.post(
              process.env.REACT_APP_REQUEST_RESET_PASSWORD,
              { email: email.trim() },
              { timeout: 20000 },
            );
            setSuccess(true);
            setMessage(
              response.data.email_delivery === 'file'
                ? 'If this account exists, a reset preview is saved in .local/outbox. Open the HTML preview to reset your password. No inbox email was sent.'
                : 'If an account exists for this email, password reset instructions have been sent.',
            );
          } catch (error) {
            setSuccess(false);
            setMessage(
              apiErrorMessage(
                error.response?.data,
                'We could not send the reset request. Please try again.',
              ),
            );
          } finally {
            submitting.current = false;
            setPending(false);
          }
        }}
      >
        <DialogTitle
          id="reset-request-title"
          sx={{ fontWeight: 900, color: '#fff' }}
        >
          Back on track.
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              color: '#aaaabd',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            Enter your account email to request a password reset link.
          </Typography>
          {message && (
            <Alert severity={success ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <TextField
            required
            autoFocus
            fullWidth
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={pending}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={pending}
            sx={{ color: '#b9b9c9' }}
          >
            Close
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={pending}
            sx={buttonSx}
          >
            {pending ? 'Sending...' : 'Send reset link'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
ForgotPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
