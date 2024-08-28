import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';

import SimpleButton from 'components/ThisSimpleButton';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  controllerName,
}) => {
  const [password, setPassword] = useState('');
  const [correctPassword, setCorrectPassword] = useState('');

  useEffect(() => {
    setCorrectPassword(controllerName + '00');
    setPassword('');
  }, [controllerName]);

  const handleConfirm = () => {
    if (password === correctPassword) {
      onConfirm();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography marginBottom={2}>
          To confirm deletion, please enter the password for &quot;
          {controllerName}&quot;.
        </Typography>
        <TextField
          label="Confirmation password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <SimpleButton onClick={onClose} color="primary">
          Cancel
        </SimpleButton>
        <SimpleButton
          onClick={handleConfirm}
          disabled={password !== correctPassword}
          sx={{
            background: password !== correctPassword ? '#35465c' : '#8D0000',
          }}
        >
          Confirm
        </SimpleButton>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  controllerName: PropTypes.string.isRequired,
};

export default DeleteConfirmationDialog;
