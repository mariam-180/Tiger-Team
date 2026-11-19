import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginRequiredDialog from './LoginRequiredDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { useAuth } from 'authContext';
import axios from 'axios';
import PropTypes from 'prop-types';

const ViaLogin = ({ handleClose }) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    userName: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, tokenValid, setRedirectPath } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (!accessToken || !tokenValid) {
        setShowLoginDialog(true);
        setRedirectPath(location.pathname + location.search);
      } else {
        fetchData();
      }
    };

    checkLoginStatus();
  }, [accessToken, tokenValid, setRedirectPath, location]);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get(
        process.env.REACT_APP_CURRENT_USER_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userData = userResponse.data;

      setProfileData({
        firstName: userData.first_name,
        lastName: userData.last_name,
        userName: userData.user_name,
        phone_number: userData.phone_number,
        email: userData.email,
        credit: `${userData.credit} JOD`,
      });

      setShowConfirmationDialog(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
    handleClose();
  };

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    handleClose();
  };

  const handleLogin = () => {
    navigate('/registration', { state: { from: location } });
    setShowLoginDialog(false);
  };

  return (
    <div>
      {showLoginDialog && (
        <LoginRequiredDialog
          onClose={handleCloseLoginDialog}
          onLogin={handleLogin}
        />
      )}
      {showConfirmationDialog && (
        <ConfirmationDialog
          onClose={handleCloseConfirmationDialog}
          profileData={profileData}
        />
      )}
    </div>
  );
};

ViaLogin.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default ViaLogin;
