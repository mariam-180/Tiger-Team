import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  backgroundColor: '#35465c',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
  padding: '10px 20px',
  borderRadius: '5px',
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2),
    borderRadius: '10px',
  },
}));

const LoginRequiredDialog = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/registration');
  };

  return (
    <StyledDialog open={true} onClose={onClose}>
      <DialogTitle variant="h5" sx={{ color: '#35465c', marginBottom: '2px' }}>
        Login Required
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ color: '#333' }}>
          You need to log in to register for the event.
        </Typography>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleLogin} color="primary">
          Login
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

LoginRequiredDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoginRequiredDialog;
