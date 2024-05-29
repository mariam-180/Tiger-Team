import React, {useState, useEffect, useCallback} from 'react';
import dayjs from 'dayjs';
import {Grid, Box, Typography} from '@mui/material';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from 'authContext';
import {useLoginRequired} from 'context/LoginRequiredContext';

// Components
import TransparentBox from 'components/ThisTransparentBox';
import ParentContainer from 'components/ThisContainer/filtered';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import CustomDatePicker from 'examples/dateTimePicker';
import BookingSummary from 'examples/summaryBox';
import RoomSelector from 'examples/branches';
import Reservation from './sections';
import Footer from 'examples/footer';

// Custom loader
import BeatLoaderUtil from 'utils/beatLoader';
import validateDateTime from 'utils/validateDateTime';
import AnimatedItem from 'utils/animatedItem';
import {useSnackbar} from 'context/SnackbarContext';

// Images
import background from 'assets/images/tigers_ai/tigersTeamCar_6.webp';
import SnokardoIMG from 'assets/images/logos/logoBlack.png';
import KeloIMG from 'assets/images/backGround/tigersTeam.png';

function Reservations() {
  const {showSnackbar} = useSnackbar();
  const {accessToken, tokenValid, setRedirectPath} = useAuth();
  const {showLoginRequired} = useLoginRequired();

  const navigate = useNavigate();
  const location = useLocation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReservation, setShowReservation] = useState(true);
  const [showBookingSummary, setshowBookingSummary] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);
  const [branch, setBranch] = useState('');
  const roundToNearestFive = (minutes) => Math.ceil(minutes / 5) * 5;
  const currentRoundedTime = dayjs()
      .minute(roundToNearestFive(dayjs().minute()))
      .second(0);

  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(currentRoundedTime);
  const [duration, setDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [branches, setBranches] = useState([]);

  const [PCs, setPCS] = useState([
    {id: 1, is_available: 'false'},
    {id: 2, is_available: 'false'},
    {id: 3, is_available: 'false'},
    {id: 4, is_available: 'false'},
    {id: 5, is_available: 'false'},
    {id: 6, is_available: 'false'},
    {id: 7, is_available: 'false'},
  ]);

  const calculateEndTime = useCallback((start, duration) => {
    const startDate = new Date(start);
    startDate.setMinutes(startDate.getMinutes() + duration);
    return startDate.toISOString();
  }, []);

  const endTime = calculateEndTime(startTime, duration);

  useEffect(() => {
    const savedState = localStorage.getItem('reservationState');
    if (savedState) {
      const {
        selectedPC,
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
      } = JSON.parse(savedState);

      setSelectedPC(selectedPC);
      setBranch(branch);
      setStartTime(dayjs(startTime));
      setDate(dayjs(date));
      setDuration(duration);
      setTotalCost(totalCost);
      setShowDatePicker(showDatePicker);
      setShowRoomSelector(showRoomSelector);
      setshowBookingSummary(showBookingSummary);
      setShowReservation(showReservation);
      setPCS(PCs);
    }
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(
            process.env.REACT_APP_BRANCHES_ENDPOINT,
        );
        const branchesData = response.data.map((branch) => {
          return {
            ...branch,
            image: branch.name === 'Al-Kilo Circle' ? KeloIMG : SnokardoIMG,
          };
        });
        setBranches(branchesData);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case '/reservations':
        setShowReservation(true);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setshowBookingSummary(false);
        break;
      case '/reservations/date-picker':
        setShowReservation(false);
        setShowDatePicker(true);
        setShowRoomSelector(false);
        setshowBookingSummary(false);
        break;
      case '/reservations/room-selector':
        setShowReservation(false);
        setShowDatePicker(false);
        setShowRoomSelector(true);
        setshowBookingSummary(false);
        break;
      case '/reservations/booking-summary':
        setShowReservation(false);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setshowBookingSummary(true);
        break;
      default:
        setShowReservation(true);
        setShowDatePicker(false);
        setShowRoomSelector(false);
        setshowBookingSummary(false);
        break;
    }
  }, [location.pathname]);

  const handleCardClick = (branch) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setLoading(true);
    setShowReservation(false);
    setBranch(branch);

    setStartTime(currentRoundedTime);
    setDate(dayjs());
    setDuration(0);
    setTotalCost(0);
    setSelectedPC(null);

    setTimeout(() => {
      setLoading(false);
      setShowDatePicker(true);
      navigate('/reservations/date-picker');
    }, 1000);
  };

  const handlePcClick = async (PC) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setSelectedPC(PC);

    const stateToSave = {
      selectedPC: PC,
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
      navigate('/login-required', {state: {from: location}});
      return;
    }

    try {
      const response = await axios.post(
          process.env.REACT_APP_CREATE_RESERVATION_ENDPOINT,
          {
            branch_id: branch.id,
            reservation_start: new Date(startTime).toISOString(),
            reservation_end: endTime,
            duration,
            pc_id: PC,
            total_cost: totalCost,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
      );

      setShowRoomSelector(false);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (response.status === 201) {
          setshowBookingSummary(true);
          navigate('/reservations/booking-summary');
          showSnackbar('Booking confirmed!', 'success');
        }
      }, 1000);
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
    setshowBookingSummary(true);
  };

  const fetchPCs = async () => {
    try {
      const response = await axios.get(
          process.env.REACT_APP_PCS_AVAILABILITY_ENDPOINT,
          {
            params: {
              branch_name: branch.name,
              start: new Date(startTime).toISOString(),
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
      if (PCsData.length !== 0) {
        setPCS(PCsData);
      }
    } catch (error) {
      console.error('Error fetching PCs:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setShowRoomSelector(true);
        setShowDatePicker(false);
        navigate('/reservations/room-selector');
      }, 1000);
    }
  };

  const checkAvailability = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const missingFields = [];
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
      {loading && <BeatLoaderUtil loading={loading} background={background} />}
      <Routes location={location}>
        <Route
          path="/"
          element={
            showReservation &&
            !loading && (
              <AnimatedItem>
                <Reservation
                  branches={branches}
                  handleCardClick={handleCardClick}
                  background={background}
                />
              </AnimatedItem>
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
                  <BookingSummary
                    branch={branch.name}
                    date={date.format('YYYY-MM-DD')}
                    startTime={startTime.format('HH:mm')}
                    duration={duration}
                    selected=""
                    totalCost={totalCost}
                  />
                  <Box sx={{height: '2vh'}} />
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
                  <TransparentBox
                    sx={{
                      marginTop: {
                        xs: '0%',
                        sm: '0%',
                        md: '0%',
                        lg: '0%',
                      },
                      marginBottom: '-5%',
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{
                        color: 'lightgray',
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      Your booking is
                      <span style={{color: 'green'}}> confirmed</span> ✅!
                    </Typography>
                  </TransparentBox>
                  <BookingSummary
                    branch={branch.name}
                    date={date.format('YYYY-MM-DD')}
                    startTime={startTime.format('HH:mm')}
                    duration={duration}
                    selected={selectedPC}
                    totalCost={totalCost}
                  />
                </ParentContainer>
              </AnimatedItem>
            )
          }
        />
      </Routes>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
    </Grid>
  );
}

export default Reservations;
