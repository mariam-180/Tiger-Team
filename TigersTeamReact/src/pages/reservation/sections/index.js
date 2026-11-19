import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import {
  ReservationProgress,
  reservationPanel,
  reservationPageSx,
} from 'examples/reservationFlow';

export default function Reservation({ handleCardClick, branches, background }) {
  return (
    <Box
      component="main"
      sx={{
        ...reservationPageSx,
        bgcolor: '#09090d',
        backgroundImage: `linear-gradient(180deg, rgba(9,9,13,0.85), #09090d 75%), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <ReservationProgress step={0} />
        <Box sx={{ py: { xs: 3, md: 3 }, maxWidth: 700 }}>
          <Typography
            sx={{
              color: '#ef7581',
              letterSpacing: '0.2em',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              fontWeight: 800,
              mb: 1.5,
            }}
          >
            Tigers Team / Reserve your drive
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: '#fff',
              fontSize: 'clamp(2rem, 4.3vw, 3.2rem)',
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              mb: 2,
            }}
          >
            Your next race
            <br />
            <Box component="span" sx={{ color: '#ef7581' }}>
              starts here.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: '#aaaabb',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              maxWidth: 480,
            }}
          >
            Choose your location, plan your session, and find your PC. Your
            place on the grid is a few steps away.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            component="h2"
            sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}
          >
            Choose your location
          </Typography>
          <Typography sx={{ color: '#9999aa', fontSize: '0.75rem' }}>
            {branches.length} {branches.length === 1 ? 'location' : 'locations'}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
            gap: 3,
          }}
        >
          {branches.map((branch, index) => (
            <Box
              component="button"
              key={branch.id}
              type="button"
              onClick={() => handleCardClick(branch)}
              aria-label={`Select ${branch.name}`}
              sx={{
                ...reservationPanel,
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0,1fr)',
                  md: 'minmax(0,0.7fr) minmax(0,1.3fr)',
                },
                alignItems: 'stretch',
                minWidth: 0,
                p: 0,
                textAlign: 'left',
                fontFamily: 'inherit',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'border-color 200ms ease, transform 200ms ease',
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: '#d42b3d',
                    transform: 'translateY(-4px)',
                  },
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  '&:hover': { transform: 'none' },
                },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  bgcolor: '#e6e6ea',
                  minHeight: { xs: 140, md: 190 },
                  height: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                }}
              >
                <Box
                  component="img"
                  src={branch.image}
                  alt={branch.name}
                  sx={{
                    maxWidth: '100%',
                    height: 130,
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 20,
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    color: '#5f5f6c',
                    letterSpacing: '0.15em',
                  }}
                >
                  LOCATION {String(index + 1).padStart(2, '0')}
                </Typography>
              </Box>
              <Box sx={{ p: { xs: 2.5, md: 3 }, minWidth: 0 }}>
                <Typography
                  component="h3"
                  sx={{
                    color: '#fff',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    mb: 1,
                  }}
                >
                  {branch.name}
                </Typography>
                <Typography
                  sx={{ color: '#ed7c88', fontSize: '0.75rem', mb: 1 }}
                >
                  {branch.location}
                </Typography>
                <Typography
                  sx={{
                    color: '#aaaabb',
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                    mb: 3,
                  }}
                >
                  {branch.description ||
                    'Choose this branch for your next racing session.'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #303039',
                    pt: 2,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                  }}
                >
                  Select location
                  <ArrowForwardRoundedIcon sx={{ color: '#ed7c88' }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        {branches.length === 0 && (
          <Box sx={{ ...reservationPanel, p: 4, textAlign: 'center' }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, mb: 1 }}>
              No locations are available right now.
            </Typography>
            <Typography sx={{ color: '#aaaabb' }}>
              Please try again later.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
Reservation.propTypes = {
  handleCardClick: PropTypes.func.isRequired,
  branches: PropTypes.array.isRequired,
  background: PropTypes.string.isRequired,
};
