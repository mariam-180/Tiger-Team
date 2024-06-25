import React, { useState } from 'react';
import PropTypes from 'prop-types';

import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  LocalizationProvider,
  DateCalendar,
  TimeClock,
} from '@mui/x-date-pickers';

import Typography from 'components/ThisTypography';

export default function ValidationBehaviorView({
  onDateTimeChange,
  handleClose,
  handleConfirm,
}) {
  const timeIncrements = [
    { value: '15m', label: '15 mins' },
    { value: '30m', label: '30 mins' },
    { value: '1h', label: '1 hour' },
    { value: '1.5h', label: '1.5 hour' },
    { value: '2h', label: '2 hour' },
  ];

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs().hour(14).minute(0));
  const [showHours, setShowHours] = useState(true);
  const [amPm, setAmPm] = useState(selectedTime.format('A'));

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    onDateTimeChange(newValue, selectedTime);
  };

  const handleTimeChange = (newValue) => {
    const minutes = newValue.minute();
    const roundedMinutes = 5 * Math.round(minutes / 5);
    const adjustedTime = newValue.minute(roundedMinutes);

    setShowHours(false);
    setSelectedTime(adjustedTime);
    onDateTimeChange(selectedDate, adjustedTime);
  };
  const toggleTimeView = () => {
    setShowHours(true);
  };

  const handleTimeIncrementChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const increment = event.target.value;
  };

  const handleAmPmChange = (event) => {
    const newAmPm = event.target.value;
    setAmPm(newAmPm);
    const hour = selectedTime.hour();
    const newHour =
      newAmPm === 'PM'
        ? hour < 12
          ? hour + 12
          : hour
        : hour >= 12
          ? hour - 12
          : hour;
    const newTime = selectedTime.hour(newHour);
    setSelectedTime(newTime);
    onDateTimeChange(selectedDate, newTime);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              disablePast
            />
          </Grid>
          <Grid item>
            <IconButton
              onClick={toggleTimeView}
              sx={{
                opacity: showHours ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out',
              }}
            >
              <ArrowBackIcon />
              <Typography>Change Time</Typography>
            </IconButton>
            <TimeClock
              value={selectedTime}
              onChange={handleTimeChange}
              view={showHours ? 'hours' : 'minutes'}
            />
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" gutterBottom>
              Duration
            </Typography>
            <FormControl variant="outlined" size="large">
              <Select
                defaultValue={timeIncrements[0].value}
                onChange={handleTimeIncrementChange}
                style={{ width: '120px', height: '30px' }}
              >
                {timeIncrements.map((increment, index) => (
                  <MenuItem key={index} value={increment.value}>
                    {increment.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item style={{ textAlign: 'center', margin: '20px' }}>
          <TextField
            label="Selected Time"
            value={selectedTime.format('hh:mm A')}
            InputProps={{ readOnly: true }}
            style={{ width: 'fit-content', margin: 'auto' }}
          />
          <Grid item>
            <FormControl variant="outlined" size="large">
              <Select
                value={amPm}
                onChange={handleAmPmChange}
                style={{ width: '80px' }}
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12} container justifyContent="center" spacing={2}>
          <Grid item>
            <Button onClick={handleClose}>Cancel</Button>
          </Grid>
          <Grid item>
            <Button onClick={handleConfirm} color="primary">
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}

ValidationBehaviorView.propTypes = {
  onDateTimeChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};
