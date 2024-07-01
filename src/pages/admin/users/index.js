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
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';

import Avatar from 'components/ThisAvatar';
import Typography from 'components/ThisTypography';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import { useSnackbar } from 'context/SnackbarContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import { formatTime } from 'utils/timeUtils';

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

const userColumns = [
  { Header: 'Author', accessor: 'author', width: '45%', align: 'left' },
  { Header: 'Username', accessor: 'user_name', align: 'left' },
  { Header: 'Credit', accessor: 'credit', align: 'center' },
  { Header: 'Role', accessor: 'role', align: 'center' },
  { Header: 'Action', accessor: 'action', align: 'center' },
];

const activitiesColumns = [
  { Header: 'Author', accessor: 'author', width: '35%', align: 'left' },
  { Header: 'Table', accessor: 'table', align: 'left' },
  { Header: 'Action', accessor: 'action', align: 'center' },
  { Header: 'Time', accessor: 'time', align: 'center' },
  { Header: 'Details', accessor: 'details', align: 'center' },
];

function AdminUsers() {
  const { accessToken, userRole } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [nonCustomerUsers, setNonCustomerUsers] = useState([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [selectedActivityDetails, setSelectedActivityDetails] = useState(null);

  const actions = ['UPDATE', 'DELETE', 'CREATE'];
  const tables = ['Reservations', 'Users'];

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    action: null,
    tableName: null,
    userId: null,
  });

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

  const fetchReportsData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_ACTIVITIES_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            start_date: filters.startDate
              ? new Date(filters.startDate).getTime()
              : null,
            end_date: filters.endDate
              ? new Date(filters.endDate).getTime()
              : null,
            action: filters.action,
            table_name: filters.tableName,
            user_id: filters.userId,
          },
        },
      );
      setActivities(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setActivities([]);
      } else {
        console.error('Error fetching reports:', error);
        showSnackbar('Error fetching reports. Please try again.', 'error');
      }
    }
  };

  const fetchData = async () => {
    try {
      const [usersResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_USERS_ENDPOINT, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);
      setUsers(usersResponse.data);
      setFilteredUsers(usersResponse.data);
      const nonCustomerUsers = usersResponse.data.filter(
        (user) => user.role !== 'END_USER',
      );

      setNonCustomerUsers(nonCustomerUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    }
  };

  const updateUser = async (id, data) => {
    try {
      await axios.patch(`${process.env.REACT_APP_USERS_ENDPOINT}${id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
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

  const handleUserSave = () => {
    updateUser(selectedUser.id, selectedUser);
    setEditUserDialogOpen(false);
  };

  const handleViewDetails = (details) => {
    setSelectedActivityDetails(details);
    setDetailsDialogOpen(true);
  };

  const handleUserDialogClose = () => setEditUserDialogOpen(false);

  const handleApplyFilters = () => {
    fetchReportsData();
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchData();
    if (roleHierarchy[userRole] === roleHierarchy['SUPER_USER']) {
      fetchReportsData();
    }
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
          sx={{ color: '#00008B', opacity: '0.9' }}
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteUser(user.id)}
          sx={{ color: '#8B0000', opacity: '0.9' }}
        >
          Delete
        </Button>
      </Box>
    ),
  }));

  const activitiesRows = activities.map((activity) => ({
    author: (
      <Author
        image={avatarImg}
        name={`${activity.user.first_name} ${activity.user.last_name}`}
        email={activity.user.email}
      />
    ),
    table: activity.table_name,
    action: activity.action,
    time: formatTime(activity.timestamp, true),
    details: (
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => handleViewDetails(activity.details)}
          sx={{ color: '#00008B', opacity: '0.9' }}
        >
          View Details
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
              marginBottom: '40px',
              marginTop: '90px',
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
          {roleHierarchy[userRole] === roleHierarchy['SUPER_USER'] && (
            <Box
              sx={{
                width: {
                  xs: '90vw',
                  sm: '92vw',
                  md: '94vw',
                  xl: '95.5vw',
                },
                marginBottom: '40px',
                marginTop: '90px',
              }}
            >
              <Box
                flexDirection="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={3}
                sx={{
                  gap: 3,
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <TextField
                  label="Users"
                  select
                  name="userId"
                  value={filters.userId || ''}
                  onChange={handleFilterChange}
                  variant="outlined"
                  sx={{
                    '.MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                    },
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                  }}
                >
                  <MenuItem value={null}>All</MenuItem>
                  {nonCustomerUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.email}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Action"
                  select
                  name="action"
                  value={filters.action || ''}
                  onChange={handleFilterChange}
                  variant="outlined"
                  sx={{
                    '.MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                    },
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                  }}
                >
                  <MenuItem value={null}>All</MenuItem>
                  {actions.map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Table"
                  select
                  name="tableName"
                  value={filters.tableName || ''}
                  onChange={handleFilterChange}
                  variant="outlined"
                  sx={{
                    '.MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                    },
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                  }}
                >
                  <MenuItem value={null}>All</MenuItem>
                  {tables.map((table) => (
                    <MenuItem key={table} value={table}>
                      {table}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="From Date"
                  type="date"
                  name="startDate"
                  value={filters.startDate || ''}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    '.MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                    },
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                  }}
                />
                <TextField
                  label="To Date"
                  type="date"
                  name="endDate"
                  value={filters.endDate || ''}
                  onChange={handleFilterChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  sx={{
                    '.MuiOutlinedInput-root': {
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '10px',
                    },
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                  sx={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    maxWidth: 'fit-content',
                    minWidth: '320px',
                    width: '100%',
                    '&:hover': {
                      background: '#333',
                    },
                  }}
                >
                  Find
                </Button>
              </Box>
              <AnimatedItem>
                <DynamicTable
                  title="Activities"
                  columns={activitiesColumns}
                  rows={activitiesRows}
                  isSorted={true}
                  canSearch={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </AnimatedItem>
            </Box>
          )}
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
            value={selectedUser?.credit || ''}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, credit: e.target.value })
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
              setSelectedUser({ ...selectedUser, role: e.target.value })
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
          <SimpleButton onClick={handleUserDialogClose} color="primary">
            Cancel
          </SimpleButton>
          <SimpleButton onClick={handleUserSave} color="primary">
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
      <StyledDialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
      >
        <DialogTitle>Activity Details</DialogTitle>
        <DialogContent>
          <Box>
            {selectedActivityDetails &&
              Object.entries(selectedActivityDetails).map(([key, value]) => (
                <Typography key={key}>
                  <strong>{key}:</strong> {JSON.stringify(value, null, 2)}
                </Typography>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <StyledButton
            onClick={() => setDetailsDialogOpen(false)}
            color="primary"
          >
            Close
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Grid>
  );
}

export default AdminUsers;
