import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Grid, Box, Typography, TextField, Button, Modal } from '@mui/material';
import { styled } from '@mui/system';

import ParentContainer from 'components/ThisContainer/filtered';

import { useSnackbar } from 'context/SnackbarContext';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get('token');
  const expiresAt = query.get('expires_at');
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (expiryDate < new Date()) {
        setIsExpired(true);
      }
    } else {
      setIsExpired(true);
    }
  }, [expiresAt]);

  useEffect(() => {
    if (isExpired) {
      showSnackbar(
        'Reset link has expired. Please request a new password reset.',
        'error',
      );
      const timer = setTimeout(() => {
        navigate('/registration');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isExpired]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      await axios.post(process.env.REACT_APP_RESET_PASSWORD, {
        token,
        new_password: newPassword,
      });
      showSnackbar('Password reset successfully', 'success');
      setTimeout(() => {
        navigate('/registration');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showSnackbar(
          'Token expired. Please request a new password reset.',
          'error',
        );
      } else {
        showSnackbar('Failed to reset password', 'error');
      }
    }
  };

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
          functions: { linearGradient, rgba },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.01),
            rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <ParentContainer
        blur={2}
        brightness={20}
        backgroundImage={backgroundImage}
        sx={{
          padding: '',
        }}
      >
        {!isExpired ? (
          <Box
            sx={{
              width: '90%',
              maxWidth: '500px',
              padding: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{
                color: '#333',
              }}
            >
              Reset Password
            </Typography>
            <form onSubmit={handlePasswordReset}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': { color: '#333' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                    '&.Mui-focused fieldset': { borderColor: '#007bff' },
                  },
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                margin="normal"
                sx={{
                  '& .MuiInputLabel-root': { color: '#333' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                    '&.Mui-focused fieldset': { borderColor: '#007bff' },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledButton color="primary" type="submit">
                  Reset Password
                </StyledButton>
              </Box>
            </form>
          </Box>
        ) : (
          <Modal
            open={isExpired}
            onClose={() => navigate('/registration')}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Link Expired
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                The reset link has expired. Please request a new password reset.
              </Typography>
            </Box>
          </Modal>
        )}
      </ParentContainer>
    </Grid>
  );
};

export default ResetPassword;
