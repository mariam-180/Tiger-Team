import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import DesktopWindowsRounded from '@mui/icons-material/DesktopWindowsRounded';
import AdaptiveRoom from './AdaptiveRoom';
import { sortPcs, hasFixedPcLayout } from 'utils/pcLayout.mjs';

const positions = {
  kilo: [
    [26, 18],
    [44, 18],
    [62, 18],
    [80, 18],
    [80, 38.5],
    [80, 59],
    [80, 79.5],
  ],
  snokardo: [
    [14, 18],
    [32, 18],
    [50, 18],
    [68, 18],
    [86, 18],
  ],
};
const statusColors = {
  Available: '#79cfa5',
  Busy: '#858597',
  Selected: '#f06a7b',
};

export default function RoomMap({ pcs = [], onPcClick, layout = 'kilo' }) {
  const ordered = sortPcs(pcs);
  if (!hasFixedPcLayout(ordered, positions[layout].length))
    return <AdaptiveRoom pcs={ordered} onPcClick={onPcClick} />;
  const availableCount = pcs.filter(
    (pc) => pc.is_available === true || pc.is_available === 'true',
  ).length;
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        bgcolor: '#111116',
        border: '1px solid #30303b',
        borderRadius: '24px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          borderBottom: '1px solid #2b2b35',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: '#ee7e8c',
              letterSpacing: '0.18em',
              fontWeight: 800,
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            The racing floor
          </Typography>
          <Typography
            component="h2"
            sx={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem' }}
          >
            {layout === 'kilo' ? 'Al-Kilo Circle' : 'Snokardo'}
          </Typography>
        </Box>
        <Typography sx={{ color: '#a8a8b8', fontSize: '0.75rem' }}>
          {availableCount} / {pcs.length} stations available
        </Typography>
      </Box>
      <Box
        component="ul"
        aria-label="Station status legend"
        sx={{
          listStyle: 'none',
          m: 0,
          px: { xs: 2, sm: 3 },
          py: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2.5,
        }}
      >
        {Object.entries(statusColors).map(([status, color]) => (
          <Box
            component="li"
            key={status}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: '#c2c2ce',
              fontSize: '0.72rem',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }}
            />
            {status}
          </Box>
        ))}
      </Box>
      <Typography
        sx={{
          display: { xs: 'block', md: 'none' },
          color: '#9292a5',
          fontSize: '0.7rem',
          px: 2,
          pb: 1,
        }}
      >
        Swipe across the map to explore all stations.
      </Typography>
      <Box
        tabIndex={0}
        role="region"
        aria-label="Interactive room layout. Scroll horizontally to explore on smaller screens."
        sx={{
          width: '100%',
          overflowX: 'auto',
          overscrollBehaviorX: 'contain',
          scrollbarWidth: 'thin',
          scrollbarColor: '#63323e #16161e',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            minWidth: 660,
            width: '100%',
            height: { xs: 410, md: 'clamp(410px, 53dvh, 510px)' },
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <path
              d={
                layout === 'kilo'
                  ? 'M 440 560 H 30 V 25 H 970 V 560 H 560'
                  : 'M 970 260 V 25 H 30 V 560 H 970 V 380'
              }
              fill="none"
              stroke="#535360"
              strokeWidth="3"
            />
            <path
              d={
                layout === 'kilo'
                  ? 'M 500 540 V 350 H 680'
                  : 'M 940 320 H 430 V 420'
              }
              fill="none"
              stroke="#3c3c4a"
              strokeWidth="2"
              strokeDasharray="6 9"
            />
            <path
              d={
                layout === 'kilo'
                  ? 'M 440 560 A 75 75 0 0 1 515 485'
                  : 'M 970 260 A 80 80 0 0 0 890 340'
              }
              fill="none"
              stroke="#a83d50"
              strokeWidth="2"
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: '6%',
              top: '43%',
              width: '16%',
              minHeight: 105,
              border: '1px solid #4a4a58',
              borderRadius: '12px',
              p: 1.5,
              boxSizing: 'border-box',
              bgcolor: '#20202a',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#a0a0b1',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                mb: 1,
              }}
            >
              RECEPTION
            </Typography>
            <Typography
              sx={{ color: '#eeeef5', fontSize: '0.8rem', fontWeight: 800 }}
            >
              Check-in desk
            </Typography>
            <Box
              aria-hidden="true"
              sx={{
                height: 3,
                width: 25,
                bgcolor: '#c62a40',
                mx: 'auto',
                mt: 1.5,
              }}
            />
          </Box>
          <Typography
            aria-hidden="true"
            sx={{
              position: 'absolute',
              left: '36%',
              top: '54%',
              color: '#555566',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
            }}
          >
            WALKWAY
          </Typography>
          {ordered.map((pc, index) => {
            const available =
              pc.is_available === true || pc.is_available === 'true';
            const status = pc.selected
              ? 'Selected'
              : available
                ? 'Available'
                : 'Busy';
            const [left, top] = positions[layout][index];
            return (
              <Button
                key={pc.id ?? pc.pc_number}
                type="button"
                disabled={!available}
                aria-pressed={Boolean(pc.selected)}
                aria-label={`PC ${pc.pc_number}, ${status}`}
                onClick={() => onPcClick(pc.pc_number)}
                sx={{
                  position: 'absolute',
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '14%',
                  minWidth: 82,
                  height: 76,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 0.5,
                  border: '1px solid',
                  borderColor: pc.selected
                    ? '#ec5b74'
                    : available
                      ? '#456957'
                      : '#343442',
                  borderRadius: '12px',
                  bgcolor: pc.selected
                    ? '#4b1e2a'
                    : available
                      ? '#17251f'
                      : '#202029',
                  color: `${statusColors[status]} !important`,
                  '&:hover, &:focus, &:focus-visible, &:active, &.Mui-focusVisible':
                    {
                      color: '#ff6479 !important',
                      '& .MuiTypography-root, & svg': {
                        color: '#ff6479 !important',
                      },
                    },
                  '& .MuiTypography-root': {
                    color: `${pc.selected ? '#ff6479' : statusColors[status]} !important`,
                  },
                  boxShadow: pc.selected
                    ? '0 0 0 3px rgba(236,91,116,0.12)'
                    : 'none',
                  transition:
                    'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    bgcolor: '#30212b',
                    borderColor: '#ec5b74',
                    color: pc.selected ? '#ff6479' : '#fff',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#202029',
                    color: '#858597',
                    borderColor: '#343442',
                  },
                  '@media (prefers-reduced-motion: reduce)': {
                    transition: 'none',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <DesktopWindowsRounded sx={{ fontSize: '17px !important' }} />
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      color: 'inherit',
                    }}
                  >
                    PC {pc.pc_number}
                  </Typography>
                </Box>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.58rem',
                    color: 'inherit',
                    letterSpacing: '0.04em',
                  }}
                >
                  {status}
                </Typography>
              </Button>
            );
          })}
          <Box
            sx={{
              position: 'absolute',
              ...(layout === 'kilo'
                ? { left: '50%', bottom: '2%' }
                : { right: '1%', top: '47%' }),
              transform:
                layout === 'kilo' ? 'translateX(-50%)' : 'translateY(-50%)',
              color: '#e48b99',
              bgcolor: '#21151b',
              border: '1px solid #69303e',
              borderRadius: '6px',
              px: 1.5,
              py: 0.5,
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
            }}
          >
            ENTRANCE
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2,
          borderTop: '1px solid #2b2b35',
          color: '#9292a5',
          fontSize: '0.75rem',
          lineHeight: 1.7,
        }}
      >
        Choose an available station. Your selection will be highlighted in red.
      </Box>
    </Box>
  );
}
RoomMap.propTypes = {
  pcs: PropTypes.array,
  onPcClick: PropTypes.func.isRequired,
  layout: PropTypes.oneOf(['kilo', 'snokardo']),
};
