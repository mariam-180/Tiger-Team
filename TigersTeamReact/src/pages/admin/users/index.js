import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import { useAdminConfirm } from '../AdminWorkspace';
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useAuth } from 'authContext';
import axios from 'axios';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

import Avatar from 'components/ThisAvatar';
import Typography from 'components/ThisTypography';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from '../AdminDataTable';
import { useSnackbar } from 'context/SnackbarContext';

import avatarImg from 'assets/images/logos/logoBlack.png';

const roleOptions = [
  { key: 'SUPER_USER', label: 'Administrator' },
  { key: 'END_USER', label: 'Customer' },
];

const userColumns = [
  { Header: 'Customer', accessor: 'author', width: '45%', align: 'left' },
  { Header: 'Username', accessor: 'user_name', align: 'left' },
  { Header: 'Phone Number', accessor: 'phone_number', align: 'left' },
  { Header: 'Credit', accessor: 'credit', align: 'center' },
  { Header: 'Role', accessor: 'role', align: 'center' },
  {
    Header: 'Action',
    accessor: 'action',
    disableSortBy: true,
    align: 'center',
  },
];

function AdminUsers() {
  const confirmDelete = useAdminConfirm();
  const [saving, setSaving] = useState(false);
  const [loadState, setLoadState] = useState('loading');
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);

  const Author = ({ image, name, email }) => (
    <Box display="flex" alignItems="center" lineHeight={1}>
      <Avatar src={image} name={name} size="sm" />
      <Box ml={2} lineHeight={1}>
        <Typography display="block" variant="button" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="caption">{email}</Typography>
      </Box>
    </Box>
  );

  const fetchData = async (background = false) => {
    background = background === true;
    if (!background) setLoadState('loading');
    try {
      const [usersResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_USERS_ENDPOINT, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setUsers(usersResponse.data);
      setFilteredUsers(usersResponse.data);
      setLoadState('ready');
    } catch (error) {
      if (background) return;
      setLoadState('error');
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    }
  };

  const updateUser = async (id, data) => {
    if (saving) return false;
    setSaving(true);
    try {
      await axios.patch(`${process.env.REACT_APP_USERS_ENDPOINT}${id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('User updated successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
    return false;
  };

  const deleteUser = async (id) => {
    if (users.find((user) => user.id === id)?.role === 'SUPER_USER') {
      showSnackbar(
        'The administrator account cannot be deleted here.',
        'warning',
      );
      return;
    }
    if (!(await confirmDelete('Delete this user record?'))) return;
    try {
      await axios.delete(`${process.env.REACT_APP_USERS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Error deleting user. Please try again.', 'error');
    }
  };

  const handleEditUser = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
    setEditUserDialogOpen(true);
  };

  const handleUserSave = async () => {
    if (
      !Number.isFinite(Number(selectedUser?.credit)) ||
      Number(selectedUser.credit) < 0
    ) {
      showSnackbar('Credit must be a non-negative amount.', 'warning');
      return;
    }
    if (
      await updateUser(selectedUser.id, {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        phone_number: selectedUser.phone_number,
        user_name: selectedUser.user_name,
        credit: Number(selectedUser.credit),
      })
    )
      setEditUserDialogOpen(false);
  };

  const handleUserDialogClose = () => setEditUserDialogOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const userRows = filteredUsers.map((user) => ({
    author: (
      <Author
        image={avatarImg}
        name={`${user.first_name} ${user.last_name}`}
        email={user.email}
      />
    ),
    user_name: user.user_name,
    phone_number: user.phone_number,
    credit: user.credit,
    role:
      roleOptions.find((role) => role.key === user.role)?.label || user.role,
    action: (
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
        <Button
          onClick={() => handleEditUser(user.id)}
          sx={{ color: '#f48297', opacity: '0.9' }}
        >
          Edit
        </Button>
        <Button
          disabled={user.role === 'SUPER_USER'}
          onClick={() => deleteUser(user.id)}
          sx={{ color: '#8B0000', opacity: '0.9' }}
        >
          Delete
        </Button>
      </Box>
    ),
  }));

  useBackgroundRefresh(() => fetchData(true), Boolean(accessToken));

  return (
    <Grid
      container
      direction="column"
      sx={{
        backgroundColor: 'transparent',
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
      <>
        <Box
          sx={{
            width: '100%',
            minWidth: 0,
            marginBottom: '40px',
            marginTop: 0,
          }}
        >
          <>
            <DynamicTable
              loadState={loadState}
              onRetry={fetchData}
              title="Users"
              columns={userColumns}
              rows={userRows}
              isSorted={true}
              canSearch={true}
              entriesPerPage={true}
              showTotalEntries={false}
              noEndBorder
            />
          </>
        </Box>
      </>

      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={editUserDialogOpen}
        onClose={handleUserDialogClose}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={selectedUser?.first_name || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, first_name: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
              marginTop: 2,
            }}
          />
          <TextField
            label="Last Name"
            value={selectedUser?.last_name || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, last_name: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Email"
            value={selectedUser?.email || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Phone Number"
            value={selectedUser?.phone_number || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, phone_number: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Username"
            value={selectedUser?.user_name || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, user_name: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Credit"
            type="number"
            value={selectedUser?.credit ?? ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, credit: e.target.value })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Account type"
            value={
              selectedUser?.role === 'SUPER_USER' ? 'Administrator' : 'Customer'
            }
            InputProps={{ readOnly: true }}
            fullWidth
            helperText="This site has one administrator and customer accounts."
          />
        </DialogContent>
        <DialogActions>
          <SimpleButton onClick={handleUserDialogClose} color="primary">
            Cancel
          </SimpleButton>
          <SimpleButton
            disabled={saving}
            onClick={handleUserSave}
            color="primary"
          >
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminUsers;
