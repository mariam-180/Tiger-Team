import LoadingScreen from 'components/LoadingScreen';
import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import { isClosedBranch } from 'utils/adminData.mjs';
import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

import { Grid, Box } from '@mui/material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from 'authContext';
import { useLoginRequired } from 'context/LoginRequiredContext';

// Components
import ParentContainer, {
  ReservationConfirmDialog,
  ReservationSuccess,
  ReservationLoading,
} from 'examples/reservationFlow';
import { StyledButton } from 'components/ThisStyledButton';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import CustomDatePicker from 'examples/dateTimePicker';
import BookingSummary from 'examples/summaryBox';
import RoomSelector from 'examples/branches';
import Reservation from '../sections';
import Footer from 'examples/footer';

// Custom loader
import validateDateTime from 'utils/validateDateTime';
import AnimatedItem from 'utils/animatedItem';
import { useSnackbar } from 'context/SnackbarContext';

// Images
import background from 'assets/images/tigers_ai/tigersTeamCar_6.webp';
import KeloIMG from 'assets/images/backGround/tigersTeam.png';

function Reservations() {
  const { showSnackbar } = useSnackbar();
  const { accessToken, tokenValid, setRedirectPath } = useAuth();
  const { showLoginRequired } = useLoginRequired();

  const navigate = useNavigate();
  const location = useLocation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReservation, setShowReservation] = useState(true);
  const [showBookingSummary, setShowBookingSummary] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedPCs, setSelectedPCs] = useState(null);
  const [branch, setBranch] = useState('');
  const roundToNearestFive = (minutes) => Math.ceil(minutes / 5) * 5;
  const currentRoundedTime = dayjs()
    .minute(roundToNearestFive(dayjs().minute()))
    .second(0);

  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(currentRoundedTime);
  const [duration, setDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [cost, setCost] = useState(0);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branches, setBranches] = useState([]);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tempPC, setTempPC] = useState(null);

  const [PCs, setPCS] = useState([
    { id: 1, is_available: 'false' },
    { id: 2, is_available: 'false' },
    { id: 3, is_available: 'false' },
    { id: 4, is_available: 'false' },
    { id: 5, is_available: 'false' },
    { id: 6, is_available: 'false' },
    { id: 7, is_available: 'false' },
  ]);

  const calculateEndTime = useCallback((start, duration) => {
    return dayjs(start)
      .utcOffset(3, true)
      .add(duration || 0, 'minute')
      .format();
  }, []);

  const endTime = dayjs(calculateEndTime(startTime, duration))
    .utcOffset(3)
    .format();

  useEffect(() => {
    const savedState = localStorage.getItem('reservationState');
    if (savedState) {
      let restored;
      try {
        restored = JSON.parse(savedState);
      } catch {
        localStorage.removeItem('reservationState');
        return;
      }
      if (
        !restored ||
        typeof restored !== 'object' ||
        isClosedBranch(restored.branch?.name)
      ) {
        localStorage.removeItem('reservationState');
        navigate('/reservations', { replace: true });
        return;
      }
      const {
        selectedPCs,
        branch,
        startTime,
        date,
        duration,
        totalCost,
        showDatePicker,
        showRoomSelector,
        showBookingSummary,
        showReservation,
        PCs,
      } = restored;

      setSelectedPCs(selectedPCs);
      setBranch(branch);
      setStartTime(dayjs(startTime));
      setDate(dayjs(date));
      setDuration(
        [30, 60, 90, 120, 150, 180].includes(Number(duration))
          ? Number(duration)
          : 0,
      );
      setTotalCost(totalCost);
      setCost(totalCost);
      setShowDatePicker(showDatePicker);
      setShowRoomSelector(showRoomSelector);
      setShowBookingSummary(showBookingSummary);
      setShowReservation(showReservation);
      setPCS(PCs);
    }
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BRANCHES_ENDPOINT);
      const branchesData = response.data
        .filter((branch) => !isClosedBranch(branch.name))
        .map((branch) => {
          return {
            ...branch,
            image: KeloIMG,
          };
        });
      setBranches(branchesData);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setBranchesLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  useBackgroundRefresh(fetchBranches);

  useEffect(() => {
    switch (location.pathname) {
      case '/reservations':
        setShowReservation(true);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setShowBookingSummary(false);
        break;
      case '/reservations/date-picker':
        setLoading(false);
        setShowReservation(false);
        setShowDatePicker(true);
        setShowRoomSelector(false);
        setShowBookingSummary(false);
        break;
      case '/reservations/room-selector':
        setLoading(false);
        setShowReservation(false);
        setShowDatePicker(false);
        setShowRoomSelector(true);
        setShowBookingSummary(false);
        break;
      case '/reservations/booking-summary':
        setLoading(false);
        setShowReservation(false);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setShowBookingSummary(true);
        break;
      default:
        setShowReservation(true);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setShowBookingSummary(false);
        break;
    }
  }, [location.pathname]);

  const handleCardClick = (branch) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setShowReservation(false);
    setBranch(branch);

    setStartTime(currentRoundedTime);
    setDate(dayjs());
    setDuration(0);
    setTotalCost(0);
    setCost(0);
    setSelectedPCs(null);

    navigate('/reservations/date-picker');
  };

  const handlePcClick = (PC) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPCs((prevSelectedPCs) => {
      if (!Array.isArray(prevSelectedPCs)) {
        prevSelectedPCs = [];
      }

      let newSelectedPCs;
      if (prevSelectedPCs.includes(PC)) {
        newSelectedPCs = prevSelectedPCs.filter((pc) => pc !== PC);
      } else {
        newSelectedPCs = [...prevSelectedPCs, PC];
      }

      const length = newSelectedPCs.length || 1;
      setTotalCost(cost * length);

      return newSelectedPCs;
    });
  };
  const handleConfirm = async () => {
    setConfirmDialogOpen(false);
    setSelectedPCs((prevSelectedPCs) => {
      if (prevSelectedPCs.includes(tempPC)) {
        return prevSelectedPCs.filter((pc) => pc !== tempPC);
      } else {
        return [...prevSelectedPCs, tempPC];
      }
    });

    const stateToSave = {
      selectedPCs: tempPC,
      branch,
      startTime,
      date,
      duration,
      totalCost,
      showDatePicker,
      showRoomSelector,
      showBookingSummary,
      showReservation,
      PCs,
    };

    localStorage.setItem('reservationState', JSON.stringify(stateToSave));

    if (!accessToken || !tokenValid) {
      showSnackbar('You need to log in first to access that page', 'warning');
      showLoginRequired();
      setRedirectPath(location.pathname + location.search);
      navigate('/login-required', { state: { from: location } });
      return;
    }

    const reservationStart = dayjs(startTime).utcOffset(3, true).format();
    const endTime = dayjs(calculateEndTime(startTime, duration))
      .utcOffset(3)
      .format();

    try {
      const response = await axios.post(
        process.env.REACT_APP_CREATE_RESERVATIONS_BULK_ENDPOINT,
        {
          branch_id: branch.id,
          reservation_start: reservationStart,
          reservation_end: endTime,
          duration,
          pc_id: selectedPCs,
          total_cost: totalCost,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 201) {
        setShowRoomSelector(false);
        setLoading(true);
        navigate('/reservations/booking-summary');
        showSnackbar('Booking confirmed!', 'success');
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 402) {
        showSnackbar(
          `Insufficient Credit!
            You do not have enough credit to make this reservation.`,
          'error',
        );
      } else {
        showSnackbar('Error confirming booking. Please try again.', 'error');
      }
    }
    setShowBookingSummary(true);
  };

  const handleCancel = () => {
    setTempPC(null);
    setConfirmDialogOpen(false);
  };

  const fetchPCs = async (background = false) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_PCS_AVAILABILITY_ENDPOINT,
        {
          params: {
            branch_name: branch.name,
            start: dayjs(startTime).utcOffset(3, true).format(),
            end: endTime,
          },
        },
      );
      const PCsData = response.data.map((pc) => {
        return {
          ...pc,
          is_available: pc.is_available ? 'true' : 'false',
        };
      });
      if (PCsData.length === 0 && !background) {
        setLoading(false);
        showSnackbar(
          'No PCs were found for this branch. Please try again.',
          'warning',
        );
        return;
      }
      setPCS(PCsData);
      if (!background) navigate('/reservations/room-selector');
    } catch (error) {
      if (background) return;
      setLoading(false);
      console.error('Error fetching PCs:', error);
      showSnackbar('Could not check availability. Please try again.', 'error');
    }
  };

  const checkAvailability = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const missingFields = [];
    setCost(totalCost);
    if (!startTime) missingFields.push('time');
    if (!date) missingFields.push('date');
    if (!duration) missingFields.push('duration');

    if (missingFields.length > 0) {
      const missingFieldMessage = `Please select ${missingFields.join(', ')}`;
      showSnackbar(missingFieldMessage, 'warning');
      return;
    }
    if (!validateDateTime(date, startTime)) {
      showSnackbar('Selected date and time are in the past', 'error');
      return;
    }
    setLoading(true);
    fetchPCs();
  };
  useBackgroundRefresh(
    () => fetchPCs(true),
    Boolean(
      branch?.name &&
        startTime &&
        endTime &&
        location.pathname.endsWith('/room-selector'),
    ),
  );

  if (branchesLoading) return <LoadingScreen label="Loading reservations" />;

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
      {loading && <ReservationLoading />}
      <Routes location={location}>
        <Route
          path="/"
          element={
            showReservation &&
            !loading && (
              <Reservation
                branches={branches}
                handleCardClick={handleCardClick}
                background={background}
              />
            )
          }
        />
        <Route
          path="/date-picker"
          element={
            showDatePicker &&
            !loading && (
              <AnimatedItem>
                <ParentContainer
                  backgroundImage={background}
                  blur="8"
                  brightness="20"
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'minmax(0,1fr)',
                        md: 'minmax(0,0.85fr) minmax(0,1.15fr)',
                      },
                      alignItems: 'start',
                      gap: 3,
                    }}
                  >
                    <BookingSummary
                      branch={branch.name}
                      date={date?.format('YYYY-MM-DD') || ''}
                      startTime={startTime?.format('HH:mm') || ''}
                      duration={duration}
                      selected=""
                      totalCost={totalCost}
                    />
                    <CustomDatePicker
                      branch={branch}
                      date={date}
                      setDate={setDate}
                      startTime={startTime}
                      setStartTime={setStartTime}
                      duration={duration}
                      setDuration={setDuration}
                      checkAvailability={checkAvailability}
                      setTotalCost={setTotalCost}
                    />
                  </Box>
                </ParentContainer>
              </AnimatedItem>
            )
          }
        />
        <Route
          path="/room-selector"
          element={
            showRoomSelector &&
            !loading && (
              <AnimatedItem>
                <ParentContainer
                  backgroundImage={background}
                  blur="8"
                  brightness="20"
                >
                  <RoomSelector
                    branch={branch}
                    PCs={PCs}
                    handlePcClick={handlePcClick}
                    loading={loading}
                  />
                </ParentContainer>
              </AnimatedItem>
            )
          }
        />
        <Route
          path="/booking-summary"
          element={
            showBookingSummary &&
            !loading && (
              <AnimatedItem>
                <ParentContainer
                  backgroundImage={background}
                  blur="8"
                  brightness="20"
                >
                  <ReservationSuccess />
                  <BookingSummary
                    branch={branch.name}
                    date={date?.format('YYYY-MM-DD') || ''}
                    startTime={startTime?.format('HH:mm') || ''}
                    duration={duration}
                    selected={selectedPCs}
                    totalCost={totalCost}
                  />
                </ParentContainer>
              </AnimatedItem>
            )
          }
        />
      </Routes>
      {showRoomSelector && !loading && (
        <StyledButton
          disabled={!selectedPCs?.length}
          variant="contained"
          color="primary"
          onClick={() => {
            setConfirmDialogOpen(true);
          }}
          sx={{
            position: 'fixed',
            bottom: 'max(12px, env(safe-area-inset-bottom))',
            maxWidth: 'calc(100% - 32px)',
            whiteSpace: 'normal',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            background: '#c71929',
            '&:hover': {
              background: '#e32b3e',
            },
          }}
        >
          Review selected PCs
        </StyledButton>
      )}
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
      <AnimatedItem>
        <ReservationConfirmDialog
          open={confirmDialogOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          branch={branch.name || ''}
          date={date?.format('YYYY-MM-DD') || ''}
          startTime={startTime?.format('HH:mm') || ''}
          duration={duration}
          selected={selectedPCs}
          totalCost={totalCost}
        />
      </AnimatedItem>
    </Grid>
  );
}

export default Reservations;
