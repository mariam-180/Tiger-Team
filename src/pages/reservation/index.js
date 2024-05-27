import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import {Grid, Box, Typography} from '@mui/material';
import {Routes, Route, useNavigate, useLocation} from 'react-router-dom';

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

// Branch data
const branches = [
  {
    ID: 'Al-Kilo Circle',
    name: 'Al-Kilo Circle',
    image: KeloIMG,
    description: 'Behind auto mall, Amman, Jordan',
    price: 6,
    totalPrice: {
      30: 4,
      60: 6,
      90: 10,
    },
  },
  {
    ID: 'Snokardo',
    name: 'Snokardo',
    image: SnokardoIMG,
    description: 'Al-Madina Al-Monawara, Amman, Jordan',
    price: 4,
  },
];

function Reservations() {
  const {showSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReservation, setShowReservation] = useState(true);
  const [showBookingSummary, setshowBookingSummary] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectedPC, setSelectedPC] = useState(null);
  const [branch, setBranch] = useState('');
  const [date, setDate] = useState(dayjs());
  const roundToNearestFive = (minutes) => Math.ceil(minutes / 5) * 5;
  const currentRoundedTime = dayjs()
      .minute(roundToNearestFive(dayjs().minute()))
      .second(0);
  const [startTime, setStartTime] = useState(currentRoundedTime);
  const [duration, setDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

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

  const handlePcClick = (PC) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setSelectedPC(PC);
    setShowRoomSelector(false);
    setshowBookingSummary(true);
    navigate('/reservations/booking-summary');
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
    setShowDatePicker(false);
    setTimeout(() => {
      setLoading(false);
      setShowRoomSelector(true);
      navigate('/reservations/room-selector');
    }, 1000);
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
                    roomType={branch.ID}
                    handlePcClick={handlePcClick}
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
