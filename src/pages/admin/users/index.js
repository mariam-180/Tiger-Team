/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import {useAuth} from 'authContext';
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
  MenuItem,
} from '@mui/material';
import Avatar from 'components/ThisAvatar';
import Typography from 'components/ThisTypography';
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import {useSnackbar} from 'context/SnackbarContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';
import avatarImg from 'assets/images/logos/logoBlack.png';

const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

const roleOptions = Object.entries(roleHierarchy).map(([key]) => ({
  label: key.replace('_', ' '),
  key,
}));

const userColumns = [
  {Header: 'Author', accessor: 'author', width: '45%', align: 'left'},
  {Header: 'Username', accessor: 'user_name', align: 'left'},
  {Header: 'Credit', accessor: 'credit', align: 'center'},
  {Header: 'Role', accessor: 'role', align: 'center'},
  {Header: 'Action', accessor: 'action', align: 'center'},
];

function AdminUsers() {
  const {accessToken} = useAuth();
  const {showSnackbar} = useSnackbar();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const Author = ({image, name, email}) => (
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

  const fetchData = async () => {
    try {
      const [usersResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_USERS_ENDPOINT, {
          headers: {Authorization: `Bearer ${accessToken}`},
        }),
      ]);
      setUsers(usersResponse.data);
      setFilteredUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    }
  };

  const updateUser = async (id, data) => {
    try {
      await axios.patch(`${process.env.REACT_APP_USERS_ENDPOINT}${id}`, data, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      fetchData();
      showSnackbar('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Error updating user. Please try again.', 'error');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_USERS_ENDPOINT}${id}`, {
        headers: {Authorization: `Bearer ${accessToken}`},
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

  const handleUserSave = () => {
    updateUser(selectedUser.id, selectedUser);
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
    credit: user.credit,
    role:
      roleOptions.find((role) => role.key === user.role)?.label || user.role,
    action: (
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => handleEditUser(user.id)}
          sx={{color: '#00008B', opacity: '0.9'}}
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteUser(user.id)}
          sx={{color: '#8B0000', opacity: '0.9'}}
        >
          Delete
        </Button>
      </Box>
    ),
  }));

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
          functions: {linearGradient, rgba},
          palette: {gradients},
        }) =>
          `${linearGradient(
              rgba(gradients.dark.main, 0.01),
              rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <ParentContainer
        blur={2}
        brightness={20}
        backgroundImage={backgroundImage}
        sx={{
          padding: '',
          alignItems: '',
        }}
      >
        <DashboardLayout>
          <Box
            sx={{
              width: {
                xs: '90vw',
                sm: '92vw',
                md: '94vw',
                xl: '95.5vw',
              },
            }}
          >
            <AnimatedItem>
              <DynamicTable
                title="Users"
                columns={userColumns}
                rows={userRows}
                isSorted={true}
                canSearch={true}
                entriesPerPage={true}
                showTotalEntries={false}
                noEndBorder
              />
            </AnimatedItem>
          </Box>
        </DashboardLayout>
      </ParentContainer>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
      <Dialog open={editUserDialogOpen} onClose={handleUserDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            value={selectedUser?.first_name || ''}
            onChange={(e) =>
              setSelectedUser({...selectedUser, first_name: e.target.value})
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
              setSelectedUser({...selectedUser, last_name: e.target.value})
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
              setSelectedUser({...selectedUser, email: e.target.value})
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
              setSelectedUser({...selectedUser, phone_number: e.target.value})
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
              setSelectedUser({...selectedUser, user_name: e.target.value})
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            label="Credit"
            type="number"
            value={selectedUser?.credit || ''}
            onChange={(e) =>
              setSelectedUser({...selectedUser, credit: e.target.value})
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          />
          <TextField
            select
            label="Role"
            value={selectedUser?.role || ''}
            onChange={(e) =>
              setSelectedUser({...selectedUser, role: e.target.value})
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
          >
            {roleOptions.map((role) => (
              <MenuItem key={role.key} value={role.key}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUserDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUserSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminUsers;
