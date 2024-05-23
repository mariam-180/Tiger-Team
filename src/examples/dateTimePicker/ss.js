import React, {useState} from 'react';
import dayjs from 'dayjs';
import {
  Box,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ListItemText,
} from '@mui/material';
import {DatePicker, TimePicker} from '@mui/x-date-pickers';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {StyledButton} from 'components/ThisStyledButton';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import {useIsMobile} from 'utils/hooks';

function CustomDatePicker() {
  const [date, setDate] = useState(dayjs());
  const roundToNearestFive = (minutes) => Math.ceil(minutes / 5) * 5;
  const currentRoundedTime = dayjs()
      .minute(roundToNearestFive(dayjs().minute()))
      .second(0);

  const [startTime, setStartTime] = useState(currentRoundedTime);
  const [duration, setDuration] = useState(10);

  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleDateChange = (newDate) => setDate(newDate);
  const handleStartTimeChange = (newTime) => setStartTime(newTime);
  const handleChange = (event) => setDuration(event.target.value);

  const formatEndTime = (minutes) => {
    return startTime.add(minutes, 'minute').format('HH:mm');
  };

  const durations = [
    {value: 15, label: '15 mins', endsLabel: 'ends at'},
    {value: 30, label: '30 mins', endsLabel: 'ends at'},
    {value: 60, label: '1 hour', endsLabel: 'ends at'},
    {value: 90, label: '1h 30m', endsLabel: 'ends at'},
  ];

  const checkAvailability = () => {
    // Logic to check availability
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: 'url(/path-to-background-image.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          padding: theme.spacing(2),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            maxWidth: '900px',
            width: '90%',
            bottom: '3%',
            backgroundColor: '#C0C0C0',
            borderRadius: '26px',
            padding: theme.spacing(3),
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? theme.spacing(2) : theme.spacing(),
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{marginBottom: theme.spacing(2)}}
          >
            Book a seat
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: theme.spacing(2),
            }}
          >
            <DatePicker
              label="Date"
              value={date}
              onChange={handleDateChange}
              minDate={dayjs()}
              maxDate={dayjs().add(1, 'day')}
              slotProps={{
                textField: {
                  sx: {
                    color: '#fff',
                    borderColor: '#fff',
                    border: '0px solid',
                  },
                },
                openPickerButton: {
                  color: 'darkRed',
                },
                popper: {
                  sx: {
                    '& .MuiList-root': {
                      backgroundColor: 'white',
                    },
                    '& .MuiMenuItem-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#2E3438',
                        color: 'white',
                      },
                      'color': 'black',
                    },
                    '& .MuiDialogActions-root': {
                      backgroundColor: 'white',
                    },
                    '& .MuiDialogActions-root .MuiButton-text': {
                      color: 'white',
                    },
                  },
                },
              }}
              sx={{flex: 1, minWidth: '150px'}}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={handleStartTimeChange}
              minTime={currentRoundedTime}
              minutesStep={5}
              slotProps={{
                textField: {
                  sx: {
                    color: '#fff',
                    borderColor: '#fff',
                    border: '0px solid',
                  },
                },
                openPickerButton: {
                  color: 'darkRed',
                },
                popper: {
                  sx: {
                    '& .MuiList-root': {
                      backgroundColor: 'white',
                    },
                    '& .MuiMenuItem-root': {
                      '&.Mui-selected': {
                        backgroundColor: '#2E3438',
                        color: 'white',
                      },
                      'color': 'black',
                    },
                    '& .MuiDialogActions-root': {
                      backgroundColor: 'white',
                    },
                    '& .MuiDialogActions-root .MuiButton-text': {
                      color: 'white',
                    },
                  },
                },
              }}
              sx={{flex: 1, minWidth: '150px'}}
            />
            <FormControl
              fullWidth
              sx={{
                flex: 1,
                minWidth: '200px',
              }}
            >
              <InputLabel id="duration-label">Duration</InputLabel>
              <Select
                labelId="duration-label"
                value={duration}
                label="Duration"
                onChange={handleChange}
                renderValue={(selected) =>
                  durations.find((option) => option.value === selected)?.label
                }
                IconComponent={() => (
                  <SlowMotionVideoIcon
                    style={{color: 'darkRed', marginRight: '10px '}}
                  />
                )}
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'center',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                  getContentAnchorEl: null,
                }}
              >
                {durations.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    style={{
                      justifyContent: 'space-between',
                      backgroundColor:
                        duration === option.value ? '#2E3438' : 'transparent',
                      color: duration === option.value ? '#fff' : 'inherit',
                    }}
                  >
                    <ListItemText primary={option.label} />
                    {duration !== option.value && (
                      <Typography
                        variant="body2"
                        color={
                          duration === option.value ? '#fff' : 'textSecondary'
                        }
                      >
                        {`${option.endsLabel} ${formatEndTime(option.value)}`}
                      </Typography>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledButton
              variant="contained"
              onClick={checkAvailability}
              sx={{
                flexGrow: 1,
                flexBasis: isMobile ? 'auto' : '200px',
                height: isMobile ? '60px' : 'auto',
              }}
            >
              Check availability
            </StyledButton>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
