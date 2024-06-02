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
import EnhancedTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import {useSnackbar} from 'context/SnackbarContext';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

const roleOptions = Object.entries(roleHierarchy).map(([key]) => ({
  label: key.replace('_', ' '),
  key,
}));

const userHeaders = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: true,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  {id: 'email', numeric: false, disablePadding: false, label: 'Email'},
  {
    id: 'phone_number',
    numeric: false,
    disablePadding: false,
    label: 'Phone Number',
  },
  {id: 'user_name', numeric: false, disablePadding: false, label: 'Username'},
  {id: 'credit', numeric: true, disablePadding: false, label: 'Credit'},
  {id: 'role', numeric: false, disablePadding: false, label: 'Role'},
];

function AdminUsers() {
  const {accessToken} = useAuth();
  const {showSnackbar} = useSnackbar();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) =>
      ['first_name', 'last_name', 'email', 'phone_number', 'user_name'].some(
          (key) => user[key].toLowerCase().includes(query),
      ),
    );

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        overflow: 'auto',
      }}
    >
      <DefaultNavbar />
      <ParentContainer
        backgroundImage={backgroundImage}
        blur={2}
        brightness={40}
      >
        <Box
          position="relative"
          sx={{
            justifyContent: {xs: 'space-between', md: 'center'},
            marginTop: '90px',
          }}
          display="flex"
          alignItems="center"
        >
          <AnimatedItem>
            <EnhancedTable
              headers={userHeaders}
              records={filteredUsers}
              onEdit={handleEditUser}
              onDelete={deleteUser}
              tableName="Users"
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </AnimatedItem>
        </Box>
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
