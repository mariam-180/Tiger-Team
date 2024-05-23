import React, {useState} from 'react';
import dayjs from 'dayjs';

// @mui material components
import {Grid, Box} from '@mui/material';
import {useTheme} from '@mui/material';

// Reservations page sections
import Reservation from './sections';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import CustomDatePicker from 'examples/dateTimePicker';
import Footer from 'examples/footer';
import BookingSummary from 'examples/summaryBox';

// Custom loader
import BeatLoaderUtil from 'utils/beatLoader';

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
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReservation, setShowReservation] = useState(true);
  const [branch, setBranch] = useState('');
  const [date, setDate] = useState(dayjs());
  const roundToNearestFive = (minutes) => Math.ceil(minutes / 5) * 5;
  const currentRoundedTime = dayjs()
      .minute(roundToNearestFive(dayjs().minute()))
      .second(0);
  const [startTime, setStartTime] = useState(currentRoundedTime);
  const [duration, setDuration] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const handleCardClick = (branch) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    setLoading(true);
    setShowReservation(false);
    setBranch(branch);
    setTimeout(() => {
      setLoading(false);
      setShowDatePicker(true);
    }, 1000);
  };

  const checkAvailability = () => {
  };

  const boxStyles = {
    'position': 'relative',
    'minHeight': '100vh',
    'padding': theme.spacing(2),
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'center',
    'alignItems': 'center',
    'gap': theme.spacing(3),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `url(${background}) no-repeat center center fixed`,
      backgroundSize: 'cover',
      filter: 'blur(8px) brightness(20%)',
      zIndex: 0,
    },
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
      {showReservation && (
        <Reservation
          branches={branches}
          handleCardClick={handleCardClick}
          background={background}
        />
      )}
      {loading && <BeatLoaderUtil loading={loading} background={background} />}
      {showDatePicker && !loading && (
        <Box sx={boxStyles}>
          <BookingSummary
            branch={branch.name}
            date={date.format('YYYY-MM-DD')}
            startTime={startTime.format('HH:mm')}
            duration={duration}
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
        </Box>
      )}
      <Footer />
    </Grid>
  );
}

export default Reservations;
