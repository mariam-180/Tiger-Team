import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktopAlt } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const SummaryBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)',
  gap: theme.spacing(4),
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '900px',
  padding: theme.spacing(3.5, 4),
  color: '#ffffff',
  background: 'rgba(0, 0, 0, 0.78)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '28px',
  boxShadow: '0 30px 70px rgba(0, 0, 0, 0.55)',
  backdropFilter: 'blur(16px) saturate(140%)',
  WebkitBackdropFilter: 'blur(16px) saturate(140%)',
  animation: `${fadeUp} 0.9s ${EASING} both`,
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: theme.spacing(2),
    padding: theme.spacing(3, 3),
    borderRadius: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2),
    borderRadius: '18px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Heading = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
}));

const Title = styled(Typography)({
  fontSize: 'clamp(2.2rem, min(5vw, 9vh), 4.2rem)',
  fontWeight: 900,
  lineHeight: 1,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
});

const TitleLine = styled(Box)({
  width: '72px',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: '#d40000',
  transformOrigin: 'left',
  animation: `${growLine} 1s ${EASING} 0.3s both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const PcBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(0.75, 2),
  fontSize: '0.95rem',
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#ffffff',
  backgroundColor: '#d40000',
  borderRadius: '999px',
  boxShadow: '0 8px 24px rgba(212, 0, 0, 0.35)',
}));

const Rows = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

const Row = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  padding: theme.spacing(1.25, 0),
  borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
  '&:last-of-type': {
    borderBottom: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 0),
  },
}));

const Label = styled(Typography)({
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.65)',
});

const Value = styled(Typography)({
  fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)',
  fontWeight: 800,
  textAlign: 'right',
  color: '#ffffff',
});

const BookingSummary = ({
  branch,
  date,
  startTime,
  selected,
  duration,
  totalCost,
}) => {
  const formattedStartTime = dayjs(`${date}T${startTime}`);
  const endTime =
    duration === 0
      ? '---'
      : formattedStartTime.add(duration, 'minute').format('HH:mm');

  const rows = [
    { label: 'Branch', value: branch },
    { label: 'Date', value: date },
    { label: 'Start', value: startTime },
    { label: 'End', value: endTime },
    { label: 'Duration', value: `${duration} mins` },
    { label: 'Total', value: `${totalCost} JOD` },
  ];

  return (
    <SummaryBox>
      <Heading>
        <Title variant="h2" component="div">
          Summary
        </Title>
        <TitleLine />
        {selected && (
          <PcBadge>
            <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
            PC {selected}
          </PcBadge>
        )}
      </Heading>
      <Rows>
        {rows.map((row) => (
          <Row key={row.label}>
            <Label>{row.label}</Label>
            <Value>{row.value}</Value>
          </Row>
        ))}
      </Rows>
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
