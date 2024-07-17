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

const registrationColumns = [
  { Header: 'Name', accessor: 'name', width: '45%', align: 'left' },
  { Header: 'Email', accessor: 'email', align: 'left' },
  { Header: 'Phone Number', accessor: 'phone_number', align: 'center' },
  {
    Header: 'Registration time',
    accessor: 'registration_time',
    align: 'left',
  },
  { Header: 'Status', accessor: 'status', align: 'center' },
  { Header: 'Action', accessor: 'action', align: 'center' },
];

function EventRegistrations() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [editRegistrationDialogOpen, setEditRegistrationDialogOpen] =
    useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_REGISTRATION_FORM_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const data = response.data;
      const users = data.users;
      const totalCount = data.total_count;
      const totalUnpaid = data.total_unpaid;
      const totalPaid = data.total_paid;
      const totalCancelled = data.total_cancelled;

      setRegistrations(users);
      setFilteredRegistrations(users);
      setTotalCount(totalCount);
      setTotalUnpaid(totalUnpaid);
      setTotalPaid(totalPaid);
      setTotalCancelled(totalCancelled);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showSnackbar('Forbidden: you do not have the required access', 'error');
      } else {
        console.error('Error fetching data:', error);
        showSnackbar('Error fetching data. Please try again.', 'error');
      }
    }
  };

  const updateRegistration = async (id, data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_REGISTRATION_FORM_ENDPOINT}${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      fetchData();
      showSnackbar('Registration updated successfully', 'success');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showSnackbar('Forbidden: you do not have the required access', 'error');
      } else {
        console.error('Error updating registration:', error);
        showSnackbar('Error updating registration. Please try again.', 'error');
      }
    }
  };

  const deleteRegistration = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_REGISTRATION_FORM_ENDPOINT}${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      fetchData();
      showSnackbar('Registration deleted successfully', 'success');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showSnackbar('Forbidden: you do not have the required access', 'error');
      } else {
        console.error('Error deleting registration:', error);
        showSnackbar('Error deleting registration. Please try again.', 'error');
      }
    }
  };

  const handleEditRegistration = (id) => {
    const registration = registrations.find((reg) => reg.id === id);
    setSelectedRegistration(registration);
    setEditRegistrationDialogOpen(true);
  };

  const handleRegistrationSave = () => {
    updateRegistration(selectedRegistration.id, selectedRegistration);
    setEditRegistrationDialogOpen(false);
  };

  const handleRegistrationDialogClose = () =>
    setEditRegistrationDialogOpen(false);

  useEffect(() => {
    fetchData();
  }, []);

  const registrationRows = filteredRegistrations.map((registration) => ({
    name: (
      <Typography display="block" variant="button" fontWeight="medium">
        {`${registration.first_name} ${registration.last_name}`}
      </Typography>
    ),
    email: registration.email,
    phone_number: registration.phone_number,
    registration_time: formatTime(registration.registration_time, true),
    status: registration.status,
    action: (
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => handleEditRegistration(registration.id)}
          sx={{ color: '#00008B', opacity: '0.9' }}
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteRegistration(registration.id)}
          sx={{ color: '#8B0000', opacity: '0.9' }}
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
              marginTop: '100px',
              marginBottom: '100px',
              width: {
                xs: '90vw',
                sm: '92vw',
                md: '94vw',
                xl: '95.5vw',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Total: {totalCount}
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Unpaid: {totalUnpaid}
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Paid: {totalPaid}
              </Typography>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Cancelled: {totalCancelled}
              </Typography>
            </Box>
            <AnimatedItem>
              <DynamicTable
                title="Event Registrations"
                columns={registrationColumns}
                rows={registrationRows}
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
      <Dialog
        open={editRegistrationDialogOpen}
        onClose={handleRegistrationDialogClose}
      >
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent sx={{ marginTop: '10px', minWidth: '20vw' }}>
          <TextField
            select
            label="Status"
            value={selectedRegistration?.status || ''}
            onChange={(e) =>
              setSelectedRegistration({
                ...selectedRegistration,
                status: e.target.value,
              })
            }
            fullWidth
            sx={{
              marginBottom: 2,
              marginTop: 2,
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiMenuItem-root': {
                whiteSpace: 'nowrap',
              },
            }}
          >
            <MenuItem value="REGISTERED">Registered</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <SimpleButton onClick={handleRegistrationDialogClose} color="primary">
            Cancel
          </SimpleButton>
          <SimpleButton onClick={handleRegistrationSave} color="primary">
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default EventRegistrations;
