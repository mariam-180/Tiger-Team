import React from 'react';
import PropTypes from 'prop-types';
import {Box, Typography} from '@mui/material';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDesktopAlt} from '@fortawesome/free-solid-svg-icons';

import styled from '@emotion/styled';
import dayjs from 'dayjs';

const SummaryBox = styled(Box)(({theme}) => ({
  'position': 'relative',
  'width': '90%',
  'maxWidth': '800px',
  'top': '100px',
  'minHeight': '50vh',
  'marginBottom': '50px',
  'padding': theme.spacing(2),
  'backgroundColor': 'rgba(255, 255, 255, 0.2)',
  'borderRadius': '10px',
  'boxShadow': '0 4px 20px rgba(139, 0, 0, 0.6)',
  'display': 'flex',
  'justifyContent': 'space-between',
  'margin': theme.spacing(3, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '40%',
    top: 0,
    width: '1px',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: 'translateX(-50%)',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '35vh',
    top: '70px',
  },
  [theme.breakpoints.up('md')]: {
    marginBottom: '70px',
  },
}));

const SummaryDetails = styled(Box)(({theme}) => ({
  position: 'absolute',
  left: '42%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
}));

const EquipmentBox = styled(Box)(({theme, isavailable, sx}) => ({
  width: '90px',
  top: '20%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  backgroundColor: isavailable === 'true' ?
    'rgba(0, 255, 0, 0.3)' :
    'rgba(255, 0, 0, 0.3)',
  borderRadius: '5px',
  border: '1px solid #BCCCDC',
  cursor: isavailable === 'true' ? 'pointer' : 'not-allowed',
  color: '#FFF',
  ...sx,
}));

const BookingSummary = ({
  branch,
  date,
  startTime,
  selected,
  duration,
  totalCost,
}) => {
  const fontSize = 'clamp(0.95rem, 1.5vw, 1.3rem)';
  const formattedStartTime = dayjs(`${date}T${startTime}`);
  let endTime;
  duration == 0 ?
    (endTime = '---') :
    (endTime = formattedStartTime.add(duration, 'minute').format('HH:mm'));

  return (
    <SummaryBox>
      <Typography
        variant="h2"
        component="div"
        sx={{
          color: 'lightgray',
          fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
        }}
      >
        Summary
      </Typography>
      {selected && (
        <EquipmentBox isavailable='true'>
          <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
          <Typography fontSize="1rem">PC {selected}</Typography>
        </EquipmentBox>
      )}
      <SummaryDetails>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          Branch: {branch}
        </Typography>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          Date: {date}
        </Typography>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          Start Time: {startTime}
        </Typography>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          End Time: {endTime}
        </Typography>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          Duration: {duration} mins
        </Typography>
        <Typography
          variant="body1"
          sx={{color: 'lightgray', fontSize: {fontSize}}}
        >
          Total Cost: {totalCost} JOD
        </Typography>
      </SummaryDetails>
    </SummaryBox>
  );
};

BookingSummary.propTypes = {
  branch: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  selected: PropTypes.any,
  duration: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
};

export default BookingSummary;
