import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingSummary from 'examples/summaryBox';
import LoadingScreen from 'components/LoadingScreen';

export const reservationButton = {
  bgcolor: '#c71929',
  backgroundImage: 'none',
  color: '#fff',
  borderRadius: '12px',
  px: 3,
  py: 1.5,
  fontWeight: 800,
  fontSize: '0.78rem',
  boxShadow: 'none',
  '&:hover': { bgcolor: '#e32b3e', color: '#fff' },
};
export const reservationPanel = {
  bgcolor: '#141419',
  border: '1px solid #303039',
  borderRadius: { xs: '20px', md: '26px' },
  color: '#fff',
  overflowWrap: 'anywhere',
  boxSizing: 'border-box',
};
export const reservationPageSx = {
  minHeight: '100vh',
  '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
  boxSizing: 'border-box',
  width: '100%',
  px: { xs: 2, sm: 3, lg: 5 },
  pt: 'clamp(112px, 16dvh, 144px)',
  pb: 'clamp(20px, 4dvh, 40px)',
  overflowWrap: 'anywhere',
  '& > *': { minWidth: 0 },
  '@media (min-width: 900px) and (max-height: 760px)': {
    pt: '108px',
    pb: 2,
    '& .reservation-heading': { py: 0 },
    '& .reservation-heading h1': { fontSize: '1.75rem' },
    '& .reservation-progress li': { pt: 0.75 },
    '& .reservation-form, & .reservation-summary': { p: 2 },
    '& .reservation-form h2': { fontSize: '1.25rem' },
    '& .reservation-pc': { minHeight: 112 },
  },
};
const steps = ['Location', 'Date & time', 'Your PC', 'Confirmed'];

export function ReservationProgress({ step = 0 }) {
  return (
    <Box
      component="ol"
      className="reservation-progress"
      aria-label="Reservation progress"
      sx={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
        gap: { xs: 0.75, sm: 2 },
        width: '100%',
        p: 0,
        m: 0,
      }}
    >
      {steps.map((label, index) => (
        <Box
          component="li"
          key={label}
          aria-current={index === step ? 'step' : undefined}
          sx={{
            borderTop: '2px solid',
            borderColor: index <= step ? '#d42b3d' : '#303039',
            pt: 1.5,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: index <= step ? '#ef7581' : '#8a8a9c',
              fontWeight: 800,
              mb: 0.5,
            }}
          >
            0{index + 1}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '0.65rem', sm: '0.8rem' },
              color: index === step ? '#fff' : '#a3a3b2',
              fontWeight: 700,
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
ReservationProgress.propTypes = { step: PropTypes.number };

export default function ReservationLayout({ children, backgroundImage }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const step = pathname.endsWith('booking-summary')
    ? 3
    : pathname.endsWith('room-selector')
      ? 2
      : 1;
  return (
    <Box
      component="main"
      sx={{
        ...reservationPageSx,
        bgcolor: '#09090d',
        backgroundImage: `linear-gradient(180deg, rgba(9,9,13,0.85), #09090d 65%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, md: 2.5 },
          '& > *': { minWidth: 0 },
        }}
      >
        <ReservationProgress step={step} />
        <Box
          className="reservation-heading"
          sx={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#ef7581',
                fontSize: '0.63rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Tigers Team / Reserve your drive
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: '#fff',
                fontSize: 'clamp(1.7rem, 4vw, 2.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              {step === 1
                ? 'Plan your next session.'
                : step === 2
                  ? 'Find your place on the grid.'
                  : 'See you at the starting line.'}
            </Typography>
          </Box>
          {step < 3 && (
            <Button
              onClick={() =>
                navigate(
                  step === 2 ? '/reservations/date-picker' : '/reservations',
                )
              }
              sx={{
                color: '#b7b7c7',
                fontSize: '0.72rem',
                '&:hover': { color: '#ef7581' },
              }}
            >
              {step === 2 ? 'Edit date & time' : 'Change location'}
            </Button>
          )}
        </Box>
        {children}
      </Box>
    </Box>
  );
}
ReservationLayout.propTypes = {
  children: PropTypes.node,
  backgroundImage: PropTypes.string,
};

export function ReservationSuccess() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        ...reservationPanel,
        p: { xs: 3, sm: 4 },
        background:
          'radial-gradient(ellipse at top right, rgba(199,25,41,0.18), transparent 65%), #141419',
      }}
    >
      <Typography
        sx={{
          color: '#ed7c88',
          fontSize: '0.65rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        You are on the grid
      </Typography>
      <Typography
        component="h2"
        sx={{
          color: '#fff',
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
          fontWeight: 900,
          mb: 1,
        }}
      >
        Your booking is confirmed.
      </Typography>
      <Typography sx={{ color: '#aaaabb', lineHeight: 1.7, mb: 2 }}>
        Your session details are below. We look forward to seeing you at the
        branch.
      </Typography>
      <Button onClick={() => navigate('/reservations')} sx={reservationButton}>
        Book another session
      </Button>
    </Box>
  );
}

export function ReservationConfirmDialog({
  open,
  onClose,
  onConfirm,
  branch,
  date,
  startTime,
  duration,
  selected,
  totalCost,
}) {
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="reservation-confirm-title"
      PaperProps={{
        sx: {
          ...reservationPanel,
          backgroundImage: 'none',
          maxHeight: 'calc(100dvh - 32px)',
          m: 2,
        },
      }}
    >
      <DialogTitle
        id="reservation-confirm-title"
        sx={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', pt: 3 }}
      >
        Ready to take your seat?
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ color: '#aaaabb', fontSize: '0.85rem', mb: 2 }}>
          Review your session before confirming your reservation.
        </Typography>
        <BookingSummary
          branch={branch}
          date={date}
          startTime={startTime}
          duration={duration}
          selected={selected}
          totalCost={totalCost}
        />
      </DialogContent>
      <DialogActions
        sx={{ p: 3, gap: 1, flexWrap: 'wrap', borderTop: '1px solid #303039' }}
      >
        <Button disabled={pending} onClick={onClose} sx={{ color: '#b7b7c7' }}>
          Go back
        </Button>
        <Button
          disabled={pending}
          sx={reservationButton}
          onClick={async () => {
            if (submitting.current) return;
            submitting.current = true;
            setPending(true);
            try {
              await onConfirm();
            } finally {
              submitting.current = false;
              setPending(false);
            }
          }}
        >
          {pending ? 'Confirming...' : 'Confirm booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
ReservationConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  branch: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  selected: PropTypes.any,
  totalCost: PropTypes.number.isRequired,
};

export function ReservationLoading() {
  return <LoadingScreen label="Preparing your session" />;
}
