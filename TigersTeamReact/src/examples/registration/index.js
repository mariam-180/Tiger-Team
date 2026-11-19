import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAuth } from 'authContext';
import { buttonSx, kickerSx, panelSx } from 'examples/design/RacingUI';
import ForgotPasswordDialog from 'examples/forgotPasswordDialog';
import { apiErrorMessage, safeRedirect } from 'utils/authData.mjs';
import hero from 'assets/images/backGround/BMW_M3.png';

export default function Registration() {
  const [mode, setMode] = useState('signin');
  const [fields, setFields] = useState({
    email: '',
    password: '',
    confirm: '',
    user_name: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [mailMode, setMailMode] = useState(null);
  const [mailMessage, setMailMessage] = useState('');
  const [mailError, setMailError] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const resendPending = useRef(false);
  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(
      () => setCooldown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [cooldown]);
  const submitting = useRef(false);
  const { login } = useAuth();
  const location = useLocation();
  const signup = mode === 'signup';
  const update = (name) => (event) =>
    setFields((current) => ({ ...current, [name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    setError('');
    if (signup && fields.password !== fields.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (
      signup &&
      (fields.password.length < 8 ||
        new TextEncoder().encode(fields.password).length > 72)
    ) {
      setError(
        'Use at least 8 characters and no more than 72 UTF-8 bytes for your password.',
      );
      return;
    }
    if (
      signup &&
      (!fields.first_name.trim() ||
        !fields.user_name.trim() ||
        !fields.phone_number.trim())
    ) {
      setError('Please complete all required fields.');
      return;
    }
    submitting.current = true;
    setPending(true);
    try {
      const response = await fetch(
        signup
          ? process.env.REACT_APP_USERS_ENDPOINT
          : process.env.REACT_APP_LOGIN_ENDPOINT,
        {
          method: 'POST',
          headers: {
            'Content-Type': signup
              ? 'application/json'
              : 'application/x-www-form-urlencoded',
          },
          body: signup
            ? JSON.stringify({
                first_name: fields.first_name.trim(),
                last_name: fields.last_name.trim(),
                user_name: fields.user_name.trim(),
                email: fields.email.trim(),
                phone_number: fields.phone_number.trim(),
                password: fields.password,
              })
            : new URLSearchParams({
                username: fields.email.trim(),
                password: fields.password,
              }).toString(),
          signal: AbortSignal.timeout(20000),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (!signup && response.status === 403) setVerification(true);
        throw new Error(
          apiErrorMessage(
            data,
            signup
              ? 'We could not create your account. Please try again.'
              : 'Sign-in failed. Please check your email and password.',
          ),
        );
      }
      if (signup) {
        setMailMode(data.email_delivery || 'smtp');
        setMailMessage('');
        setVerification(true);
        setFields((current) => ({ ...current, password: '', confirm: '' }));
      } else {
        if (typeof data.access_token !== 'string')
          throw new Error('The server did not return a valid session.');
        const requested = new URLSearchParams(location.search).get('redirect');
        await login(
          data.access_token,
          requested === null ? undefined : safeRedirect(requested),
        );
      }
    } catch (err) {
      setError(
        err.name === 'TimeoutError'
          ? 'The request took too long. Please try again.'
          : err.message || 'Unable to connect. Please try again.',
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };
  const resendVerification = async () => {
    if (resendPending.current || cooldown) return;
    resendPending.current = true;
    setResending(true);
    setMailMessage('');
    try {
      const response = await fetch('/api/users/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fields.email.trim() }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(
          apiErrorMessage(data, 'We could not resend your verification link.'),
        );
      setMailMode(data.email_delivery || 'smtp');
      setMailError(false);
      setMailMessage(
        data.email_delivery === 'file'
          ? 'If this account needs verification, a preview is saved in .local/outbox. No inbox email was sent.'
          : 'If this account needs verification, a new link has been sent.',
      );
      setCooldown(60);
    } catch (err) {
      setMailError(true);
      setMailMessage(err.message || 'Unable to resend the email.');
    } finally {
      resendPending.current = false;
      setResending(false);
    }
  };
  const input = (name, label, options = {}) => (
    <TextField
      key={name}
      name={name}
      label={label}
      value={fields[name]}
      onChange={update(name)}
      required
      disabled={pending}
      fullWidth
      {...options}
    />
  );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0,1fr)',
          lg: 'minmax(0,1fr) minmax(0,1fr)',
        },
        gap: { xs: 3, lg: 6 },
        alignItems: 'center',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={kickerSx}>Tigers Team / Driver access</Typography>
        <Typography
          component="h1"
          sx={{
            color: '#fff',
            fontWeight: 900,
            fontSize: 'clamp(2.5rem,5vw,4.5rem)',
            lineHeight: 1.03,
            letterSpacing: '-0.04em',
            maxWidth: 600,
          }}
        >
          Your next lap.
          <br />
          <Box component="span" sx={{ color: '#f18a9b' }}>
            Your own story.
          </Box>
        </Typography>
        <Typography
          sx={{ color: '#acacbf', lineHeight: 1.8, mt: 3, maxWidth: 450 }}
        >
          Sign in to reserve your place on the grid, manage your sessions, and
          complete your racing setup.
        </Typography>
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            mt: 4,
            height: 230,
            backgroundImage: `linear-gradient(0deg, #090a0f, transparent 65%), url(${hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '24px',
            border: '1px solid #33313f',
          }}
        />
      </Box>
      <Box
        sx={{
          ...panelSx,
          p: { xs: 2.5, sm: 4 },
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          boxSizing: 'border-box',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        }}
      >
        <Tabs
          value={mode}
          onChange={(_, value) => {
            if (!pending) {
              setMode(value);
              setError('');
              setFields((current) => ({
                ...current,
                password: '',
                confirm: '',
              }));
            }
          }}
          aria-label="Account access"
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: '1px solid #34343f',
            '& .MuiTab-root': { color: '#aaaabd', fontWeight: 800 },
            '& .Mui-selected': { color: '#f18a9b !important' },
            '& .MuiTabs-indicator': { bgcolor: '#d62a4b' },
          }}
        >
          <Tab value="signin" label="Sign in" disabled={pending} />
          <Tab value="signup" label="Create account" disabled={pending} />
        </Tabs>
        <Typography
          component="h2"
          sx={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, mb: 0.75 }}
        >
          {signup ? 'Join the starting grid.' : 'Welcome back, driver.'}
        </Typography>
        <Typography sx={{ color: '#aaaabd', fontSize: '0.85rem', mb: 3 }}>
          {signup
            ? 'Create your account, then verify your email to get started.'
            : 'Use the email address associated with your account.'}
        </Typography>
        <Box
          component="form"
          onSubmit={submit}
          aria-busy={pending}
          sx={{ display: 'grid', gap: 2.25 }}
        >
          {new URLSearchParams(location.search).get('verified') === '1' && (
            <Alert severity="success">
              Email verified. Sign in to continue.
            </Alert>
          )}
          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}
          {signup && (
            <>
              {input('user_name', 'Username', { autoComplete: 'username' })}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'minmax(0,1fr)',
                    sm: 'repeat(2,minmax(0,1fr))',
                  },
                  gap: 2,
                }}
              >
                {input('first_name', 'First name', {
                  autoComplete: 'given-name',
                })}
                {input('last_name', 'Last name', {
                  required: false,
                  autoComplete: 'family-name',
                })}
              </Box>
            </>
          )}
          {input('email', 'Email address', {
            type: 'email',
            autoComplete: signup ? 'email' : 'username',
          })}
          {signup &&
            input('phone_number', 'Phone number', {
              type: 'tel',
              autoComplete: 'tel',
            })}
          {input('password', 'Password', {
            type: showPassword ? 'text' : 'password',
            autoComplete: signup ? 'new-password' : 'current-password',
            inputProps: signup ? { minLength: 8, maxLength: 72 } : {},
            helperText: signup ? 'At least 8 characters.' : undefined,
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    sx={{ minWidth: 44, px: 0.5, color: '#ee8da1' }}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputAdornment>
              ),
            },
          })}
          {signup &&
            input('confirm', 'Confirm password', {
              type: showPassword ? 'text' : 'password',
              autoComplete: 'new-password',
            })}
          {!signup && (
            <Button
              type="button"
              onClick={() => setForgot(true)}
              disabled={pending}
              sx={{
                justifySelf: 'end',
                color: '#c6a2b0',
                fontSize: '0.75rem',
                p: 0.5,
              }}
            >
              Forgot password?
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={pending}
            sx={{ ...buttonSx, mt: 0.5 }}
          >
            {pending
              ? signup
                ? 'Creating your account...'
                : 'Signing you in...'
              : signup
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </Box>
      </Box>
      <ForgotPasswordDialog open={forgot} onClose={() => setForgot(false)} />
      <Dialog
        open={verification}
        onClose={() => setVerification(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="verify-title"
        PaperProps={{ sx: { ...panelSx, backgroundImage: 'none', p: 1 } }}
      >
        <DialogTitle id="verify-title" sx={{ fontWeight: 900, color: '#fff' }}>
          {mailMode === 'file'
            ? 'Your local email preview is ready.'
            : 'Verify your email.'}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#b7b7c9', lineHeight: 1.8 }}>
            {mailMode === 'file'
              ? 'This development server saves email previews in .local/outbox instead of sending real email. Open the newest HTML preview and click Verify Email. Real inbox delivery needs a configured SMTP sender.'
              : 'Open the verification link in your email before signing in. Check your spam folder, or request a new link below.'}
          </Typography>
          {mailMessage && (
            <Alert severity={mailError ? 'error' : 'success'} sx={{ mt: 2 }}>
              {mailMessage}
            </Alert>
          )}
          <Button
            disabled={resending || cooldown > 0 || !fields.email.trim()}
            onClick={resendVerification}
            sx={{ color: '#f18a9b', mt: 2 }}
          >
            {resending
              ? 'Sending...'
              : cooldown
                ? `Resend in ${cooldown}s`
                : 'Resend verification link'}
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setVerification(false);
              setMode('signin');
              setError('');
            }}
            sx={buttonSx}
          >
            Back to sign in
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
