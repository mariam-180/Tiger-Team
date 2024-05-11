import React, {useState} from 'react';
import {
  TextField,
  Box,
  useTheme,
  MenuItem,
  InputAdornment,
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
  const [duration, setDuration] = useState(1);

  const theme = useTheme();
  const isMobile = window.innerWidth < 768;

  const handleDateChange = (newDate) => setDate(newDate);
  const handleStartTimeChange = (newTime) => setStartTime(newTime);
  const handleDurationChange = (event) => setDuration(event.target.value);

  const checkAvailability = () => {
    // Logic to check availability
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            display: 'flex',
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
              <TextField
                label="Duration"
                type="number"
                value={duration}
                Select
                onChange={handleDurationChange}
                InputProps={{
                  ...(!isMobile ?
                    {
                      endAdornment: (
                        <InputAdornment position="start">
                          <SlowMotionVideoIcon color="darkRed" />
                        </InputAdornment>
                      ),
                    } :
                    {}),
                  inputProps: {min: 5},
                }}
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
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
              </TextField>
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
