import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import RacingPage, {
  panelSx,
  kickerSx,
  buttonSx,
} from 'examples/design/RacingUI';
import { apiErrorMessage } from 'utils/authData.mjs';

export default function ResetPassword() {
  const token = new URLSearchParams(useLocation().search).get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  return (
    <RacingPage>
      <Box sx={{ ...panelSx, maxWidth: 520, mx: 'auto', p: { xs: 3, sm: 4 } }}>
        <Typography sx={kickerSx}>A fresh start</Typography>
        <Typography
          component="h1"
          sx={{ fontSize: '2rem', color: '#fff', fontWeight: 900, mb: 1 }}
        >
          Back in control.
        </Typography>
        <Typography sx={{ color: '#aaaabd', lineHeight: 1.8, mb: 3 }}>
          Choose a new password for your driver account.
        </Typography>
        {!token ? (
          <Alert severity="error">
            This reset link is missing its token. Request a new link from the
            sign-in page.
          </Alert>
        ) : success ? (
          <Alert severity="success">
            Your password has been updated. Sign in with your new password.
          </Alert>
        ) : (
          <Box
            component="form"
            sx={{ display: 'grid', gap: 2 }}
            onSubmit={async (event) => {
              event.preventDefault();
              if (submitting.current) return;
              setError('');
              if (password !== confirm) {
                setError('Passwords do not match.');
                return;
              }
              if (
                password.length < 8 ||
                new TextEncoder().encode(password).length > 72
              ) {
                setError(
                  'Use at least 8 characters and no more than 72 UTF-8 bytes.',
                );
                return;
              }
              submitting.current = true;
              setPending(true);
              try {
                await axios.post(
                  process.env.REACT_APP_RESET_PASSWORD,
                  { token, new_password: password },
                  { timeout: 20000 },
                );
                setSuccess(true);
                setPassword('');
                setConfirm('');
              } catch (err) {
                setError(
                  apiErrorMessage(
                    err.response?.data,
                    'Unable to reset the password. Please request a new link or try again.',
                  ),
                );
              } finally {
                submitting.current = false;
                setPending(false);
              }
            }}
          >
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="New password"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              disabled={pending}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              inputProps={{ minLength: 8, maxLength: 72 }}
              helperText="At least 8 characters."
            />
            <TextField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              required
              fullWidth
              disabled={pending}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={pending}
              sx={buttonSx}
            >
              {pending ? 'Updating password...' : 'Set new password'}
            </Button>
          </Box>
        )}
        <Button
          component={Link}
          to="/registration"
          sx={{ color: '#ef8da2', mt: 3, px: 0 }}
        >
          Back to sign in
        </Button>
      </Box>
    </RacingPage>
  );
}
