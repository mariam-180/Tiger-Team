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
} from '@mui/material';
import EnhancedTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import {useSnackbar} from 'context/SnackbarContext';

import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';

import AnimatedItem from 'utils/animatedItem';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

const reservationHeaders = [
  {
    id: 'branch_name',
    numeric: true,
    disablePadding: true,
    label: 'Branch Name',
  },
  {id: 'pc_number', numeric: true, disablePadding: false, label: 'PC Number'},
  {id: 'user_name', numeric: false, disablePadding: false, label: 'Username'},
  {
    id: 'reservation_start',
    numeric: false,
    disablePadding: false,
    label: 'Reservation Start',
  },
  {
    id: 'reservation_end',
    numeric: false,
    disablePadding: false,
    label: 'Reservation End',
  },
  {id: 'duration', numeric: true, disablePadding: false, label: 'Duration'},
  {
    id: 'total_cost',
    numeric: true,
    disablePadding: false,
    label: 'Total Cost',
  },
];

function AdminReservaions() {
  const {accessToken} = useAuth();

  const {showSnackbar} = useSnackbar();
  const [reservations, setReservations] = useState([]);
  const [editReservationDialogOpen, setEditReservationDialogOpen] =
    useState(false);
  const [filteredReservation, setFilteredReservation] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchData = async () => {
    try {
      const [reservationsResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_RESERVATION_ENDPOINT, {
          headers: {Authorization: `Bearer ${accessToken}`},
        }),
      ]);
      setReservations(reservationsResponse.data);
      setFilteredReservation(reservationsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Error fetching data. Please try again.', 'error');
    }
  };

  const updateReservation = async (id, data) => {
    try {
      await axios.patch(
          `${process.env.REACT_APP_RESERVATION_ENDPOINT}${id}`,
          data,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
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
        headers: {Authorization: `Bearer ${accessToken}`},
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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = reservations.filter((reservation) =>
      ['branch_name', 'pc_number', 'user_name'].some(
          (key) => reservation[key].toLowerCase().includes(query),
      ),
    );

    setFilteredReservation(filtered);
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
              headers={reservationHeaders}
              records={filteredReservation}
              onEdit={handleEditReservation}
              onDelete={deleteReservation}
              tableName="Reservations"
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </AnimatedItem>
        </Box>
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
            label="Branch ID"
            value={selectedReservation?.branch_id || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                branch_id: e.target.value,
              })
            }
            fullWidth
            sx={{
              marginBottom: 2,
              marginTop: 2,
            }}
          />
          <TextField
            label="PC ID"
            value={selectedReservation?.pc_id || ''}
            onChange={(e) =>
              setSelectedReservation({
                ...selectedReservation,
                pc_id: e.target.value,
              })
            }
            fullWidth
            sx={{
              marginBottom: 2,
            }}
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
            sx={{
              marginBottom: 2,
            }}
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
            sx={{
              marginBottom: 2,
            }}
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
            sx={{
              marginBottom: 2,
            }}
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
            sx={{
              marginBottom: 2,
            }}
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

export default AdminReservaions;
