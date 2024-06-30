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
  Typography,
  Switch,
} from '@mui/material';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import { useSnackbar } from 'context/SnackbarContext';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';
import { playSound, stopSound } from 'utils/playSound';
import ConfettiUtil from 'utils/confettiUtil';
import { formatTime } from 'utils/timeUtils';
import filterByHistoryFlag from 'utils/reservations/filterUtils';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';
import sound from 'assets/sounds/epic-trap-intro.mp3';

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
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [firstVisit, setFirstVisit] = useState(true);
  const [showSnoHistory, setShowSnoHistory] = useState(false);
  const [showKloHistory, setShowKloHistory] = useState(false);

  const fetchData = async () => {
    try {
      const reservationsResponse = await axios.get(
        process.env.REACT_APP_RESERVATION_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            history: true,
          },
        },
      );
      const fetchedReservations = reservationsResponse.data;

      const addedOrUpdated = fetchedReservations.some((newReservation) => {
        const existingReservation = reservations.find(
          (res) => res.id === newReservation.id,
        );

        return (
          !existingReservation ||
          Object.keys(newReservation).some(
            (key) => newReservation[key] !== existingReservation[key],
          )
        );
      });

      const deleted = reservations.some(
        (existingReservation) =>
          !fetchedReservations.some(
            (reservation) => reservation.id === existingReservation.id,
          ),
      );

      if (addedOrUpdated || deleted) {
        if (!firstVisit) {
          playSound(sound);
          setShowConfetti(true);
          setShowPopup(true);
        }
        setReservations(fetchedReservations);
        setFilteredReservations(applyFilter(fetchedReservations, filter));

        if (addedOrUpdated) {
          fetchedReservations.forEach((newReservation) => {
            const existingReservation = reservations.find(
              (res) => res.id === newReservation.id,
            );

            if (!existingReservation) {
              const { branch_name: branchName, user_name: userName } =
                newReservation;
              if (!firstVisit) {
                showSnackbar(
                  `New record found! Branch: ${branchName}, User: ${userName}`,
                  'success',
                );
              }
            } else {
              const updatedFields = Object.keys(newReservation).filter(
                (key) => newReservation[key] !== existingReservation[key],
              );
              if (updatedFields.length > 0) {
                const { branch_name: branchName, user_name: userName } =
                  newReservation;
                if (!firstVisit) {
                  showSnackbar(
                    `Record updated! Branch: ${branchName}, User: ${userName}`,
                    'info',
                  );
                }
              }
            }
          });
        }

        if (deleted) {
          if (!firstVisit) {
            showSnackbar('Record deleted!', 'info');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        showSnackbar('Error fetching data. Please try again.', 'error');
      }
    }
  };

  const applyFilter = (data, filter) => {
    if (!filter) return data;
    return data.filter(
      (item) =>
        item.branch_name.includes(filter) || item.user_name.includes(filter),
    );
  };

  const getReservation = async () => {
    try {
      const reservationsResponse = await axios.get(
        process.env.REACT_APP_RESERVATION_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            history: true,
          },
        },
      );
      const fetchedReservations = reservationsResponse.data;
      setReservations(fetchedReservations);
      setFilteredReservations(applyFilter(fetchedReservations, filter));
    } catch (error) {
      console.error('Error fetching reservations:', error);
      showSnackbar('Error fetching reservations. Please try again.', 'error');
    }
  };

  const updateReservation = async (id, data) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_RESERVATION_ENDPOINT}${id}`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      data;
      fetchData();
      showSnackbar('Reservation updated successfully', 'success');
    } catch (error) {
      console.error('Error updating reservation:', error);
      if (error.response && error.response.status === 409) {
        showSnackbar(
          `PC ${data.pc_number} is already reserved for this time`,
          'warning',
        );
      } else {
        showSnackbar('Error updating reservation. Please try again.', 'error');
      }
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

  const toggleSnoShowHistory = () => {
    setShowSnoHistory((prevShowHistory) => !prevShowHistory);
  };

  const toggleKloShowHistory = () => {
    setShowKloHistory((prevShowHistory) => !prevShowHistory);
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, [accessToken, showSnackbar, filter]);

  useEffect(() => {
    setFilteredReservations(applyFilter(reservations, filter));
  }, [filter, reservations]);

  useEffect(() => {
    getReservation();
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [accessToken]);

  useEffect(() => {
    if (!showPopup && showConfetti) {
      const timeoutId = setTimeout(() => {
        setShowConfetti(false);
      }, 6000);
      return () => clearTimeout(timeoutId);
    }
  }, [accessToken, showPopup, showConfetti]);

  useEffect(() => {
    setFirstVisit(false);
  }, []);

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
    reservation_start: formatTime(reservation.reservation_start),
    reservation_end: formatTime(reservation.reservation_end),
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
    reservation_start: formatTime(reservation.reservation_start),
    reservation_end: formatTime(reservation.reservation_end),
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

  const alKiloCircleFilteredRows = filterByHistoryFlag(
    alKiloCircleRows,
    showKloHistory,
  );
  const snokardoFilteredRows = filterByHistoryFlag(
    snokardoRows,
    showSnoHistory,
  );

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
              <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                sx={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px',
                  maxWidth: 'fit-content',
                  width: '100%',
                }}
              >
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  History
                </Typography>
                <Switch
                  checked={showKloHistory}
                  onChange={toggleKloShowHistory}
                  color="primary"
                  inputProps={{ 'aria-label': 'toggle show history' }}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: '#bdbdbd',
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#3f51b5',
                    },
                  }}
                />
              </Box>
              <DynamicTable
                title="Al-Kilo Circle Reservations"
                columns={reservationColumns}
                rows={alKiloCircleFilteredRows}
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
              <Box
                display="flex"
                alignItems="center"
                marginBottom={2}
                sx={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '10px',
                  maxWidth: 'fit-content',
                  width: '100%',
                }}
              >
                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  History
                </Typography>
                <Switch
                  checked={showSnoHistory}
                  onChange={toggleSnoShowHistory}
                  color="primary"
                  inputProps={{ 'aria-label': 'toggle show history' }}
                  sx={{
                    '& .MuiSwitch-track': {
                      backgroundColor: '#bdbdbd',
                    },
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#3f51b5',
                    },
                  }}
                />
              </Box>
              <DynamicTable
                title="Snokardo Reservations"
                columns={reservationColumns}
                rows={snokardoFilteredRows}
                isSorted
                canSearch
                entriesPerPage
                showTotalEntries={false}
                noEndBorder
              />
            </AnimatedItem>
          </Box>
          {showConfetti && (
            <ConfettiUtil
              run={showConfetti}
              onComplete={() => setShowConfetti(false)}
            />
          )}
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
          <SimpleButton onClick={handleReservationDialogClose} color="primary">
            Cancel
          </SimpleButton>
          <SimpleButton onClick={handleReservationSave} color="primary">
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
      {showPopup && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            zIndex: 9999,
            color: '#fff',
          }}
        >
          <Typography variant="h1" sx={{ marginBottom: 2, color: 'gold' }}>
            Updates Acknowledgement
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Updates have been applied successfully. Click
            &quot;Acknowledged&quot; to close this message.
          </Typography>
          <SimpleButton
            sx={{ color: '#00008B', opacity: '1', background: 'gold' }}
            onClick={() => {
              setShowPopup(false);
              stopSound();
              setShowConfetti(false);
            }}
            variant="contained"
          >
            Acknowledged
          </SimpleButton>
        </Box>
      )}
    </Grid>
  );
}

export default AdminReservations;
