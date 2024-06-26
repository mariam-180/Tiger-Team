import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useSnackbar } from 'context/SnackbarContext';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';

const NoteText = styled(Typography)({
  color: '#e52d27',
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '16px',
  fontStyle: 'italic',
  fontWeight: 'bold',
});

const InfoBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '20px',
  color: '#4caf50',
});

const InfoText = styled(Typography)({
  fontSize: '18px',
  color: '#333',
  fontWeight: 'bold',
});

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

const ConfirmationDialog = ({ onClose, profileData }) => {
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    first_name: profileData.firstName || '',
    last_name: profileData.lastName || '',
    email: profileData.email || '',
    phone_number: profileData.phone_number || '',
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone_number: profileData.phone_number,
      });
    }
  }, [profileData]);

  const handleConfirm = async () => {
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
        showSnackbar('Registered successfully!', 'success');
        onClose();
      } else if (response.status === 409) {
        showSnackbar('Error: Unable to register; Already registered!', 'error');
      } else {
        showSnackbar(
          'Error: Unable to register, Please contact administration',
          'error',
        );
      }
    } catch (error) {
      showSnackbar(`Error: Unable to register; ${error}.`, 'error');
    }
  };

  return (
    <StyledDialog open={true} onClose={onClose}>
      <DialogTitle variant="h5" sx={{ color: '#35465c', marginBottom: '2px' }}>
        Confirm Registration
      </DialogTitle>
      <DialogContent>
        <InfoBox>
          <InfoText>
            Full Name: {`${formData.first_name} ${formData.last_name}`}
          </InfoText>
          <InfoText>Email: {formData.email}</InfoText>
          <InfoText>Phone Number: {formData.phone_number}</InfoText>
          <NoteText>
            To confirm your registration for the event, please advance to the
            nearest branch to process the payment.
          </NoteText>
        </InfoBox>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          Cancel
        </StyledButton>
        <StyledButton onClick={handleConfirm} color="primary">
          Submit
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  profileData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }).isRequired,
};

export default ConfirmationDialog;
