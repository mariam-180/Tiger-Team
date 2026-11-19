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
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import Typography from 'components/ThisTypography';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from '../AdminDataTable';
import { useSnackbar } from 'context/SnackbarContext';
import { formatTime } from 'utils/timeUtils';

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
  {
    Header: 'Action',
    accessor: 'action',
    disableSortBy: true,
    align: 'center',
  },
];

function EventRegistrations() {
  const confirmDelete = useAdminConfirm();
  const [saving, setSaving] = useState(false);
  const [loadState, setLoadState] = useState('loading');
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
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_EVENTS_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showSnackbar('Error fetching events. Please try again.', 'error');
    }
  };

  const fetchData = async (background = false) => {
    background = background === true;
    if (!background) setLoadState('loading');
    try {
      const REGISTRATION_ENDPOINT = new URL(
        process.env.REACT_APP_REGISTRATION_FORM_ENDPOINT,
        window.location.origin,
      );

      if (selectedEvent) {
        REGISTRATION_ENDPOINT.searchParams.append('event_name', selectedEvent);
      }

      const response = await axios.get(REGISTRATION_ENDPOINT.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
      setLoadState('ready');
    } catch (error) {
      if (background) return;
      setLoadState('error');
      if (error.response && error.response.status === 403) {
        showSnackbar('Forbidden: you do not have the required access', 'error');
      } else {
        console.error('Error fetching data:', error);
        showSnackbar('Error fetching data. Please try again.', 'error');
      }
    }
  };

  const updateRegistration = async (id, data) => {
    if (saving) return false;
    setSaving(true);
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
      return true;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showSnackbar('Forbidden: you do not have the required access', 'error');
      } else {
        console.error('Error updating registration:', error);
        showSnackbar('Error updating registration. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
    return false;
  };

  const deleteRegistration = async (id) => {
    if (!(await confirmDelete('Delete this registration record?'))) return;
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

  const handleRegistrationSave = async () => {
    if (await updateRegistration(selectedRegistration.id, selectedRegistration))
      setEditRegistrationDialogOpen(false);
  };

  const handleRegistrationDialogClose = () =>
    setEditRegistrationDialogOpen(false);

  useEffect(() => {
    fetchEvents();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchData();
    }
  }, [selectedEvent]);

  const registrationRows = filteredRegistrations.map((registration) => ({
    name: (
      <Typography display="block" variant="button" fontWeight="medium">
        {`${registration.first_name} ${registration.last_name}`}
      </Typography>
    ),
    email: registration.email,
    phone_number: registration.phone_number,
    __sortValues: {
      registration_time: Date.parse(registration.registration_time),
    },
    registration_time: formatTime(registration.registration_time, true),
    status: registration.status,
    action: (
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
        <Button
          onClick={() => handleEditRegistration(registration.id)}
          sx={{ color: '#f48297', opacity: '0.9' }}
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
            marginTop: 0,
            marginBottom: 3,
            width: '100%',
            minWidth: 0,
          }}
        >
          <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
            <InputLabel id="event-select-label" shrink>
              Select event
            </InputLabel>
            <Select
              labelId="event-select-label"
              label="Select event"
              displayEmpty
              value={selectedEvent || ''}
              onChange={(event) => setSelectedEvent(event.target.value)}
            >
              <MenuItem value="">All events</MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.name}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              flexWrap: 'wrap',
              gap: 2,
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
          <>
            <DynamicTable
              loadState={loadState}
              onRetry={fetchData}
              title="Event Registrations"
              columns={registrationColumns}
              rows={registrationRows}
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
        open={editRegistrationDialogOpen}
        onClose={handleRegistrationDialogClose}
      >
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent sx={{ marginTop: '10px', minWidth: 0 }}>
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
          <SimpleButton
            disabled={saving}
            onClick={handleRegistrationSave}
            color="primary"
          >
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default EventRegistrations;
