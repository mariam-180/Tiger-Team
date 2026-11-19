import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import DesktopWindowsRounded from '@mui/icons-material/DesktopWindowsRounded';

export default function AdaptiveRoom({ pcs, onPcClick, branchName }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 1100, minWidth: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.35rem',
              mb: 0.5,
            }}
          >
            {branchName || 'Choose your PC'}
          </Typography>
          <Typography sx={{ color: '#aaaabb', fontSize: '0.8rem' }}>
            Select an available station to reserve your session.
          </Typography>
        </Box>
        <Typography
          sx={{
            color: '#ed7c88',
            fontSize: '0.75rem',
            border: '1px solid #71313d',
            borderRadius: '100px',
            px: 1.5,
            py: 0.75,
          }}
        >
          {
            pcs.filter(
              (pc) => pc.is_available === true || pc.is_available === 'true',
            ).length
          }{' '}
          of {pcs.length} available
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
          gap: 2,
        }}
      >
        {pcs.map((pc) => {
          const available =
            pc.is_available === true || pc.is_available === 'true';
          return (
            <Button
              className="reservation-pc"
              key={pc.id ?? pc.pc_number}
              disabled={!available}
              aria-pressed={Boolean(pc.selected)}
              onClick={() => onPcClick(pc.pc_number)}
              sx={{
                minHeight: 145,
                minWidth: 0,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                gap: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: pc.selected ? '#ee3344' : 'rgba(255,255,255,0.2)',
                bgcolor: pc.selected ? 'rgba(200,25,40,0.3)' : '#17171e',
                color: pc.selected ? '#ff6479 !important' : '#fff',
                '&:hover, &:focus, &:focus-visible, &:active, &.Mui-focusVisible':
                  {
                    color: '#ff6479 !important',
                    '& .MuiTypography-root, & svg': {
                      color: '#ff6479 !important',
                    },
                  },
                '& .MuiTypography-root': {
                  color: pc.selected ? '#ff6479 !important' : 'inherit',
                },
                overflowWrap: 'anywhere',
                '&.Mui-disabled': { color: '#999', bgcolor: '#24242a' },
                '&:hover': { bgcolor: '#352027' },
              }}
            >
              <DesktopWindowsRounded />
              <Typography
                component="span"
                sx={{ color: 'inherit', fontWeight: 900, fontSize: '1.15rem' }}
              >
                PC {pc.pc_number}
              </Typography>
              <Typography component="span" sx={{ fontSize: '0.7rem' }}>
                {available ? 'Available' : 'Busy'}
              </Typography>
            </Button>
          );
        })}
      </Box>
      {pcs.length === 0 && (
        <Typography sx={{ color: '#ccc' }}>
          No PCs are configured for this branch yet.
        </Typography>
      )}
    </Box>
  );
}

AdaptiveRoom.propTypes = {
  branchName: PropTypes.string,
  pcs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      pc_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      selected: PropTypes.bool,
      is_available: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    }),
  ).isRequired,
  onPcClick: PropTypes.func.isRequired,
};
