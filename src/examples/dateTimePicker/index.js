import React, {useState} from 'react';
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

import dayjs from 'dayjs';

function CustomDatePicker() {
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [duration, setDuration] = useState(10);

  const theme = useTheme();
  const isMobile = window.innerWidth < 768;

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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
          minHeight: '100vh',
          backgroundColor: '#000',
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            maxWidth: '900px',
            width: '100%',
            backgroundColor: '#C0C0C0',
            borderRadius: '16px',
            padding: theme.spacing(3),
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            // display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? theme.spacing(2) : theme.spacing(0),
          }}
        >
          <Box
            sx={{
              color: '#000',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing(2),
            }}
          >
            <span>Book a seat</span>
          </Box>
          <Box
            sx={{
              color: 'E8E9E9',
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing(2),
            }}
          >
            <Box
              sx={{
                boxShadow: !isMobile ? '0 4px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '5px',
                flexGrow: 1,
                flexBasis: '200px',
                padding: theme.spacing(0.5),
              }}
            >
              <DatePicker
                label="Date"
                value={date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    color: 'darkRed',
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
              />
            </Box>
            <Box
              sx={{
                boxShadow: !isMobile ? '0 4px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '5px',
                flexGrow: 1,
                flexBasis: '200px',
                padding: theme.spacing(0.5),
              }}
            >
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={handleStartTimeChange}
                slotProps={{
                  textField: {
                    color: 'darkRed',
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
              />
            </Box>
            <Box
              sx={{
                boxShadow: !isMobile ? '0 4px rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '5px',
                flexGrow: 1,
                flexBasis: '200px',
                padding: theme.spacing(0.5),
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="duration-label">Duration</InputLabel>
                <Select
                  labelId="duration-label"
                  value={duration}
                  label="Duration"
                  onChange={handleChange}
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
                        width: '300px',
                        backgroundColor:
                          duration === option.value ? '#2E3438' : 'transparent',
                        color: duration === option.value ? '#fff' : 'inherit',
                      }}
                    >
                      <ListItemText primary={option.label} />
                      <Typography
                        variant="body2"
                        color={
                          duration === option.value ? '#fff' : 'textSecondary'
                        }
                      >
                        {`${option.endsLabel} ${formatEndTime(option.value)}`}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <StyledButton
              variant="contained"
              onClick={checkAvailability}
              sx={
                isMobile ?
                  {
                    flexGrow: 1,
                    flexBasis: '200px',
                    height: '60px',
                  } :
                  {
                    flexGrow: 1,
                    flexBasis: '200px',
                  }
              }
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
