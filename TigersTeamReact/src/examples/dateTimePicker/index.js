import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { reservationButton, reservationPanel } from 'examples/reservationFlow';

function CustomDatePicker({
  branch,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  setDuration,
  checkAvailability,
  setTotalCost,
}) {
  const outerTheme = useTheme();
  const theme = useMemo(
    () =>
      createTheme(outerTheme, {
        palette: {
          mode: 'dark',
          primary: { main: '#dc3548' },
          background: { paper: '#1b1b23', default: '#141419' },
          text: { primary: '#f4f4fa', secondary: '#aaaabb' },
        },
        components: {
          MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
          MuiOutlinedInput: {
            styleOverrides: {
              root: { borderRadius: 12, backgroundColor: '#1b1b23' },
            },
          },
        },
      }),
    [outerTheme],
  );
  const now = dayjs();
  const roundedTime = now.minute(Math.ceil(now.minute() / 5) * 5).second(0);
  const durations = [
    [30, '30 minutes'],
    [60, '1 hour'],
    [90, '1 hour 30 minutes'],
    [120, '2 hours'],
    [150, '2 hours 30 minutes'],
    [180, '3 hours'],
  ];
  const handleChange = (event) => {
    const value = Number(event.target.value);
    setDuration(value);
    setTotalCost(
      branch.name === 'Al-Kilo Circle'
        ? branch.total_price[value]
        : (value / 60) * branch.price,
    );
  };
  const fieldSx = {
    width: '100%',
    minWidth: 0,
    '& .MuiInputLabel-root': { color: '#aaaabb' },
    '& .MuiInputBase-input': { color: '#fff' },
    '& .MuiIconButton-root': { color: '#ed7c88' },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#42424f' },
  };
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          className="reservation-form"
          sx={{ ...reservationPanel, p: { xs: 2.5, sm: 3 }, width: '100%' }}
        >
          <Typography
            sx={{
              color: '#ef7581',
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              mb: 1,
            }}
          >
            Make time for the race
          </Typography>
          <Typography
            component="h2"
            sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, mb: 1 }}
          >
            When are you driving?
          </Typography>
          <Typography
            sx={{
              color: '#aaaabb',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              mb: 3,
            }}
          >
            Choose a date, starting time, and session length to see available
            PCs.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0,1fr)',
                sm: 'repeat(2,minmax(0,1fr))',
              },
              gap: 2.5,
            }}
          >
            <DatePicker
              label="Session date"
              value={date}
              onChange={setDate}
              minDate={dayjs()}
              maxDate={dayjs().add(1, 'day')}
              sx={fieldSx}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="Starting time"
              value={startTime}
              onChange={setStartTime}
              minTime={date?.isSame(now, 'day') ? roundedTime : undefined}
              minutesStep={5}
              sx={fieldSx}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <FormControl sx={{ ...fieldSx, gridColumn: '1 / -1' }}>
              <InputLabel id="duration-label">Session length</InputLabel>
              <Select
                labelId="duration-label"
                label="Session length"
                value={
                  durations.some(([value]) => value === duration)
                    ? duration
                    : ''
                }
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#1b1b23',
                      color: '#fff',
                      border: '1px solid #42424f',
                    },
                  },
                }}
              >
                {durations.map(([value, label]) => (
                  <MenuItem
                    key={value}
                    value={value}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: 1,
                      py: 1.5,
                      '&.Mui-selected': { bgcolor: 'rgba(199,25,41,0.22)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', color: 'inherit' }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#aaaabb' }}>
                      {startTime?.isValid()
                        ? `Ends at ${startTime.add(value, 'minute').format('HH:mm')}`
                        : ''}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            fullWidth
            onClick={checkAvailability}
            sx={{ ...reservationButton, mt: 3 }}
          >
            Check availability
          </Button>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

CustomDatePicker.propTypes = {
  branch: PropTypes.object.isRequired,
  date: PropTypes.object,
  setDate: PropTypes.func.isRequired,
  startTime: PropTypes.object,
  setStartTime: PropTypes.func.isRequired,
  duration: PropTypes.oneOf([0, 30, 60, 90, 120, 150, 180]).isRequired,
  setDuration: PropTypes.func.isRequired,
  checkAvailability: PropTypes.func.isRequired,
  setTotalCost: PropTypes.func.isRequired,
};

export default CustomDatePicker;
