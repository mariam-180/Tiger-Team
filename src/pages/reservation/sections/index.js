import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';
const TILT_DEGREES = 12;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const driftWord = keyframes`
  from { transform: translate(-50%, -50%) translateX(-3%); }
  to { transform: translate(-50%, -50%) translateX(3%); }
`;

const Stage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'background',
})(({ theme, background }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: '100%',
  minHeight: '100vh',
  '@supports (height: 100dvh)': {
    minHeight: '100dvh',
  },
  padding: theme.spacing(14, 6, 5),
  overflow: 'hidden',
  backgroundColor: '#000000',
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.5)), url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(12, 3, 4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(11, 1.5, 3),
  },
}));

const GhostWord = styled('div')({
  position: 'absolute',
  top: '50%',
  left: '50%',
  zIndex: 0,
  fontSize: 'clamp(5rem, 22vw, 22rem)',
  fontWeight: 900,
  lineHeight: 0.8,
  letterSpacing: '-0.04em',
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  userSelect: 'none',
  transform: 'translate(-50%, -50%)',
  animation: `${driftWord} 20s ease-in-out infinite alternate`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const Heading = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  maxWidth: '980px',
  marginBottom: theme.spacing(5),
  padding: theme.spacing(3, 5),
  textAlign: 'center',
  color: '#ffffff',
  background: 'rgba(0, 0, 0, 0.78)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: '24px',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  animation: `${fadeUp} 0.9s ${EASING} both`,
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2, 2),
    borderRadius: '16px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Eyebrow = styled(Typography)({
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.4em',
  textTransform: 'uppercase',
  color: '#ffffff',
});

const Title = styled(Typography)({
  marginTop: '12px',
  maxWidth: '900px',
  fontSize: 'clamp(1.8rem, min(4.4vw, 7vh), 3.8rem)',
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
  color: '#ffffff',
});

const TitleLine = styled(Box)(({ theme }) => ({
  width: '84px',
  height: '4px',
  margin: theme.spacing(2, 0, 1.5),
  borderRadius: '2px',
  backgroundColor: '#d40000',
  transformOrigin: 'center',
  animation: `${growLine} 1s ${EASING} 0.3s both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  maxWidth: '560px',
  fontSize: 'clamp(0.88rem, 1.2vw, 1.05rem)',
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.92)',
  [theme.breakpoints.down('sm')]: {
    lineHeight: 1.5,
  },
}));

const CardRow = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 400px))',
  justifyContent: 'center',
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: '1300px',
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: theme.spacing(2),
  },
}));

const Card = styled('button')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: 0,
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  color: '#ffffff',
  background: 'rgba(0, 0, 0, 0.82)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '28px',
  boxShadow: '0 30px 70px rgba(0, 0, 0, 0.5)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  transform:
    'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
  transformStyle: 'preserve-3d',
  animation: `${fadeUp} 1s ${EASING} both`,
  transition: 'transform 0.35s ease-out, border-color 0.4s ease',
  '&:nth-of-type(2)': { animationDelay: '0.15s' },
  '&:nth-of-type(3)': { animationDelay: '0.3s' },
  '&:nth-of-type(4)': { animationDelay: '0.45s' },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    width: '100%',
    height: '4px',
    backgroundColor: '#d40000',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
    transition: `transform 0.8s ${EASING}`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    opacity: 0,
    pointerEvents: 'none',
    background:
      'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.22), transparent 55%)',
    transition: 'opacity 0.4s ease',
  },
  '&:focus-visible': {
    outline: '2px solid #ffffff',
    outlineOffset: '4px',
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: '20px',
  },
  [HOVER_QUERY]: {
    '&:hover': {
      borderColor: 'rgba(255, 255, 255, 0.55)',
      '&::before': {
        transform: 'scaleX(1)',
      },
      '&::after': {
        opacity: 1,
      },
      '& .card-image': {
        transform: 'scale(1.1) translateZ(40px)',
      },
      '& .card-arrow': {
        transform: 'translateX(10px)',
      },
      '& .card-rule': {
        transform: 'scaleX(1)',
      },
    },
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
    transition: 'none',
  },
}));

const Media = styled(Box)({
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  width: '100%',
  aspectRatio: '16 / 10',
  overflow: 'hidden',
  backgroundColor: '#111111',
});

const MediaBackdrop = styled('img')({
  position: 'absolute',
  inset: '-20px',
  width: 'calc(100% + 40px)',
  height: 'calc(100% + 40px)',
  objectFit: 'cover',
  filter: 'blur(22px) brightness(0.55) saturate(1.3)',
});

const MediaImage = styled('img')({
  position: 'relative',
  width: '70%',
  height: '78%',
  objectFit: 'contain',
  filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.7))',
  transition: `transform 0.9s ${EASING}`,
});

const Index = styled('span')({
  position: 'absolute',
  top: '14px',
  left: '20px',
  zIndex: 1,
  fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
  fontWeight: 900,
  lineHeight: 1,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.85)',
});

const Body = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  padding: theme.spacing(3, 3.5, 3.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5, 2.5, 3),
  },
}));

const Name = styled(Typography)({
  fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
});

const Description = styled(Typography)({
  minHeight: '3.2em',
  fontSize: '0.95rem',
  lineHeight: 1.6,
  color: 'rgba(255, 255, 255, 0.92)',
});

const Rule = styled(Box)({
  width: '100%',
  height: '1px',
  marginTop: '4px',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  transformOrigin: 'left',
  transform: 'scaleX(0.25)',
  transition: `transform 0.8s ${EASING}`,
});

const Action = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(0.5),
  fontSize: '0.85rem',
  fontWeight: 800,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  '& .card-arrow': {
    transition: `transform 0.2s ${EASING}`,
  },
}));

const handleTilt = (event) => {
  const card = event.currentTarget;
  const { left, top, width, height } = card.getBoundingClientRect();
  const ratioX = (event.clientX - left) / width;
  const ratioY = (event.clientY - top) / height;

  card.style.setProperty('--rx', `${(0.5 - ratioY) * TILT_DEGREES}deg`);
  card.style.setProperty('--ry', `${(ratioX - 0.5) * TILT_DEGREES}deg`);
  card.style.setProperty('--gx', `${ratioX * 100}%`);
  card.style.setProperty('--gy', `${ratioY * 100}%`);
};

const resetTilt = (event) => {
  const card = event.currentTarget;

  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
};

function Reservation({ handleCardClick, branches, background }) {
  return (
    <Stage background={background}>
      <GhostWord aria-hidden="true">BRANCHES</GhostWord>
      <Heading>
        <Eyebrow>Tigers Team Racing</Eyebrow>
        <Title variant="h1">
          Explore our awesome branches and choose your favorite!
        </Title>
        <TitleLine />
        <Subtitle>
          Each branch has something unique and exciting to offer. Find out more
          below!
        </Subtitle>
      </Heading>
      <CardRow>
        {branches.map((branch, index) => (
          <Card
            key={branch.id ?? index}
            type="button"
            aria-label={`Select ${branch.name}`}
            onClick={() => handleCardClick(branch)}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <Media>
              <MediaBackdrop src={branch.image} alt="" aria-hidden="true" />
              <MediaImage
                className="card-image"
                src={branch.image}
                alt={branch.name}
              />
              <Index aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </Index>
            </Media>
            <Body>
              <Name component="div">{branch.name}</Name>
              <Description>{branch.description}</Description>
              <Rule className="card-rule" />
              <Action>
                Select branch
                <ArrowForwardRoundedIcon className="card-arrow" />
              </Action>
            </Body>
          </Card>
        ))}
      </CardRow>
    </Stage>
  );
}

Reservation.propTypes = {
  handleCardClick: PropTypes.func.isRequired,
  branches: PropTypes.array.isRequired,
  background: PropTypes.string,
};

export default Reservation;
