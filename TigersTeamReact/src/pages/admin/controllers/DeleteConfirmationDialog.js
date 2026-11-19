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
  controllerName = '',
  pending = false,
}) => {
  const [confirmationName, setConfirmationName] = useState('');

  useEffect(() => {
    setConfirmationName('');
  }, [controllerName, open]);

  const handleConfirm = () => {
    if (controllerName && confirmationName === controllerName && !pending) {
      onConfirm();
    }
  };

  return (
    <Dialog
      className="admin-dialog"
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={pending ? undefined : onClose}
    >
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography marginBottom={2}>
          Type the setting name &quot;{controllerName}&quot; to confirm
          deletion. This is a confirmation step, not your account password. This
          action cannot be undone.
        </Typography>
        <TextField
          label="Setting name"
          value={confirmationName}
          onChange={(e) => setConfirmationName(e.target.value)}
          disabled={pending}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <SimpleButton disabled={pending} onClick={onClose} color="primary">
          Cancel
        </SimpleButton>
        <SimpleButton
          onClick={handleConfirm}
          disabled={
            !controllerName || confirmationName !== controllerName || pending
          }
          sx={{
            background: '#8D0000',
          }}
        >
          {pending ? 'Deleting...' : 'Delete setting'}
        </SimpleButton>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  controllerName: PropTypes.string,
  pending: PropTypes.bool,
};

export default DeleteConfirmationDialog;
