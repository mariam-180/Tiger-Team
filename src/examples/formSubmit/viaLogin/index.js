/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios'; // Import axios for API requests
import { useAuth } from 'authContext'; // Import useAuth hook for authentication

const LoginRequiredDialog = ({ onClose }) => {
  const navigate = useNavigate(); // Hook for navigation
  const { accessToken } = useAuth(); // Access token from your authentication context

  const handleLogin = () => {
    navigate('/registration'); // Redirect to login page
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Login Required</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You need to log in to access this page.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary">Cancel</Button>
        <Button onClick={handleLogin} color="primary">
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LoginRequiredDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
};

const ConfirmationDialog = ({ onClose, onConfirm }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    mobileNumber: '',
    email: '',
    credit: '',
  });
  const { accessToken } = useAuth(); // Access token from your authentication context

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user data using accessToken
        const userResponse = await axios.get(
          process.env.REACT_APP_CURRENT_USER_ENDPOINT,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const userData = userResponse.data;
        // Assuming user data is received, set profileData state
        setProfileData({
          firstName: userData.first_name,
          lastName: userData.last_name,
          userName: userData.user_name,
          mobileNumber: userData.phone_number,
          email: userData.email,
          credit: `${userData.credit} JOD`,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Handle error (e.g., show error message)
      }
    };

    if (accessToken) {
      fetchData(); // Fetch user data if accessToken is available
    }
  }, [accessToken]);

  const handleConfirm = async () => {
    try {
      // Perform registration logic here (e.g., API call to register user)
      // Replace with actual registration endpoint and logic
      const registrationResponse = await axios.post(
        process.env.REACT_APP_REGISTER_ENDPOINT,
        { ...profileData },
      );

      // Assuming registration successful, trigger onConfirm callback
      onConfirm();
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., show error message)
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Confirm Registration</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Full Name"
          fullWidth
          value={profileData.firstName + ' ' + profileData.lastName}
          disabled
        />
        <TextField
          margin="dense"
          label="Email Address"
          fullWidth
          value={profileData.email}
          disabled
        />
        <TextField
          margin="dense"
          label="Phone Number"
          fullWidth
          value={profileData.mobileNumber}
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export { LoginRequiredDialog, ConfirmationDialog };
