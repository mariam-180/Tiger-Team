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
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import { useSnackbar } from 'context/SnackbarContext';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

const reservationColumns = [
  { Header: 'Branch Name', accessor: 'branch_name', align: 'left' },
  { Header: 'PC Number', accessor: 'pc_number', align: 'left' },
  { Header: 'Username', accessor: 'user_name', align: 'left' },
  { Header: 'Reservation Start', accessor: 'reservation_start', align: 'left' },
  { Header: 'Reservation End', accessor: 'reservation_end', align: 'left' },
  { Header: 'Duration', accessor: 'duration', align: 'left' },
  { Header: 'Total Cost', accessor: 'total_cost', align: 'left' },
  { Header: 'Action', accessor: 'action', align: 'center' },
];

function AdminReservations() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filter] = useState('');
  const [editReservationDialogOpen, setEditReservationDialogOpen] =
    useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const fetchData = async () => {
    try {
      const reservationsResponse = await axios.get(
        process.env.REACT_APP_RESERVATION_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const fetchedReservations = reservationsResponse.data;
      setReservations(fetchedReservations);
      setFilteredReservations(applyFilter(fetchedReservations, filter));
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    }
  };

  const applyFilter = (data, filter) => {
    if (!filter) return data;
    return data.filter(
      (item) =>
        item.branch_name.includes(filter) || item.user_name.includes(filter),
    );
  };

  const updateReservation = async (id, data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_RESERVATION_ENDPOINT}${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      fetchData();
      showSnackbar('Reservation updated successfully', 'success');
    } catch (error) {
      console.error('Error updating reservation:', error);
      showSnackbar('Error updating reservation. Please try again.', 'error');
    }
  };

  const deleteReservation = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_RESERVATION_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('Reservation deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      showSnackbar('Error deleting reservation. Please try again.', 'error');
    }
  };

  const handleEditReservation = (id) => {
    const reservation = reservations.find(
      (reservation) => reservation.id === id,
    );
    setSelectedReservation(reservation);
    setEditReservationDialogOpen(true);
  };

  const handleReservationDialogClose = () =>
    setEditReservationDialogOpen(false);

  const handleReservationSave = () => {
    updateReservation(selectedReservation.id, selectedReservation);
    setEditReservationDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 180000);
    return () => clearInterval(intervalId);
  }, [accessToken, showSnackbar, filter]);

  useEffect(() => {
    setFilteredReservations(applyFilter(reservations, filter));
  }, [filter, reservations]);

  const alKiloCircleReservations = filteredReservations.filter(
    (reservation) => reservation.branch_name === 'Al-Kilo Circle',
  );

  const snokardoReservations = filteredReservations.filter(
    (reservation) => reservation.branch_name === 'Snokardo',
  );

  const alKiloCircleRows = alKiloCircleReservations.map((reservation) => ({
    branch_name: reservation.branch_name,
    pc_number: reservation.pc_number,
    user_name: reservation.user_name,
    reservation_start: reservation.reservation_start,
    reservation_end: reservation.reservation_end,
    duration: reservation.duration,
    total_cost: reservation.total_cost,
    action: (
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => handleEditReservation(reservation.id)}
          sx={{ color: '#00008B', opacity: '0.9' }}
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteReservation(reservation.id)}
          sx={{ color: '#8B0000', opacity: '0.9' }}
        >
          Delete
        </Button>
      </Box>
    ),
  }));

  const snokardoRows = snokardoReservations.map((reservation) => ({
    branch_name: reservation.branch_name,
    pc_number: reservation.pc_number,
    user_name: reservation.user_name,
    reservation_start: reservation.reservation_start,
    reservation_end: reservation.reservation_end,
    duration: reservation.duration,
    total_cost: reservation.total_cost,
    action: (
      <Box display="flex" justifyContent="center">
        <Button
          onClick={() => handleEditReservation(reservation.id)}
          sx={{ color: '#00008B', opacity: '0.9' }}
        >
          Edit
        </Button>
        <Button
          onClick={() => deleteReservation(reservation.id)}
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
        backgroundImage={backgroundImage}
        blur={2}
        brightness={20}
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
                title="Al-Kilo Circle Reservations"
                columns={reservationColumns}
                rows={alKiloCircleRows}
                isSorted
                canSearch
                entriesPerPage
                showTotalEntries={false}
                noEndBorder
              />
            </AnimatedItem>
          </Box>
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
                title="Snokardo Reservations"
                columns={reservationColumns}
                rows={snokardoRows}
                isSorted
                canSearch
                entriesPerPage
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
        open={editReservationDialogOpen}
        onClose={handleReservationDialogClose}
      >
        <DialogTitle>Edit Reservation</DialogTitle>
        <DialogContent>
          <TextField
            label="Branch Name"
            value={selectedReservation?.branch_name || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                branch_name: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            label="PC Number"
            value={selectedReservation?.pc_number || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                pc_number: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Username"
            value={selectedReservation?.user_name || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                user_name: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Reservation Start"
            value={selectedReservation?.reservation_start || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                reservation_start: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Reservation End"
            value={selectedReservation?.reservation_end || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                reservation_end: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Duration"
            value={selectedReservation?.duration || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                duration: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Total Cost"
            value={selectedReservation?.total_cost || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                total_cost: e.target.value,
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReservationDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReservationSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminReservations;
