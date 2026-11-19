import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function BookingSummary({
  branch,
  date,
  startTime,
  selected,
  duration,
  totalCost,
}) {
  const end =
    duration && date && startTime
      ? dayjs(`${date}T${startTime}`).add(duration, 'minute').format('HH:mm')
      : 'Not selected';
  const selectedPcs = Array.isArray(selected)
    ? selected
    : selected
      ? [selected]
      : [];
  const rows = [
    ['Location', branch || 'Not selected'],
    ['Date', date || 'Not selected'],
    ['Start time', startTime || 'Not selected'],
    ['End time', end],
    ['Duration', duration ? `${duration} minutes` : 'Not selected'],
  ];
  return (
    <Box
      className="reservation-summary"
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        p: { xs: 2.5, sm: 3 },
        bgcolor: '#141419',
        border: '1px solid #303039',
        borderRadius: '22px',
        color: '#fff',
        overflowWrap: 'anywhere',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography
          component="h2"
          sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}
        >
          Your session
        </Typography>
        <Typography
          sx={{
            color: '#ed7c88',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Booking overview
        </Typography>
      </Box>
      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0,1fr)',
            sm: 'repeat(3,minmax(0,1fr))',
          },
          gap: 2,
          m: 0,
        }}
      >
        {rows.map(([label, value]) => (
          <Box key={label} sx={{ minWidth: 0 }}>
            <Typography
              component="dt"
              sx={{ color: '#9292a5', fontSize: '0.66rem', mb: 0.5 }}
            >
              {label}
            </Typography>
            <Typography
              component="dd"
              sx={{
                color: '#eeeef5',
                fontSize: '0.85rem',
                fontWeight: 700,
                m: 0,
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      {selectedPcs.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 2 }}>
          {selectedPcs.map((pc) => (
            <Box
              key={pc}
              sx={{
                px: 1.5,
                py: 0.65,
                bgcolor: 'rgba(199,25,41,0.15)',
                border: '1px solid #71313d',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#ffa6b1',
              }}
            >
              PC {pc}
            </Box>
          ))}
        </Box>
      )}
      <Box
        sx={{
          mt: 2.5,
          pt: 2,
          borderTop: '1px solid #303039',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography sx={{ color: '#aaaabb', fontSize: '0.8rem' }}>
          Session total
        </Typography>
        <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900 }}>
          {new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(
            totalCost,
          )}{' '}
          <Box component="span" sx={{ fontSize: '0.65rem', color: '#9292a5' }}>
            JOD
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
BookingSummary.propTypes = {
  branch: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  selected: PropTypes.any,
  duration: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
};
