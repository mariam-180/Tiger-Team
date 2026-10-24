import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, keyframes } from '@mui/material/styles';

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const HOVER_QUERY = '@media (hover: hover)';
const REDUCED_MOTION_QUERY = '@media (prefers-reduced-motion: reduce)';

const SECTIONS = [
  {
    title: 'About',
    paragraphs: [
      'The inaugural Tigers Team Champion League, a first-of-its-kind annual championship in the region, is organized by the Tigers Team Center in collaboration with Jordan Speed Center. Scheduled to take place on 22nd Nov, 2024, this event is a celebration of drifting simulation, designed to challenge and entertain participants and spectators alike. With a commitment to inclusively and excellence, the championship will feature a meticulously organized race format, including a Tandem Drift event with qualification rounds leading to a top 32 competition. It promises to be a landmark event, fostering a competitive yet welcoming environment for enthusiasts of all ages.',
    ],
  },
  {
    title: 'Registration',
    items: [
      'Registration is exclusively online through the official website and opens one month before the championship.',
      'The championship is open to individuals of all ages, with no age restrictions.',
      'Participation fee: 18 Jordanian Dinars, covering 3 hours of training to familiarize participants with the cars.',
      'Participants are urged to seek approval swiftly after submitting their payment.',
      'A briefing meeting for participants will discuss championship details and Terms and Conditions after registration closes.',
    ],
  },
  {
    title: 'Race Format',
    items: [
      'First Round: Begins with a Qualifying step, where each participant gets two runs to select their best for evaluation. The top 32 participants advance to the Tandem Drift competition.',
      "Subsequent Rounds: Follow the same format as the first, with the event culminating in the selection of Jordan's champion in drifting simulation.",
      'Vehicles: A limited selection of private drift vehicles will be available to participants 15 days before the championship starts.',
      'Tracks: Details of the championship track will be unveiled one week prior to the event.',
    ],
  },
  {
    title: 'Prizes',
    items: [
      '1st Place: 400 JD',
      '2nd Place: 200 JD',
      '3rd Place: 100 JD',
      'Sponsors may offer additional non-cash prizes for participants and spectators.',
      'Prizes are awarded on the coronation day, concluding the third round.',
    ],
  },
  {
    title: 'Good to Know',
    paragraphs: [
      "The championship will take place at a Tigers Team branch in Amman, with the potential for location changes based on the event's scale and participant numbers. Offering opportunities for partnerships and sponsorships, this event extends a warm welcome to companies interested in supporting a burgeoning sports community. Judging will be conducted by a seasoned committee, ensuring the championship adheres to international standards. This initiative is not just about crowning a champion but nurturing a passionate community, offering a platform for skill enhancement and sportsmanship in an inclusive setting.",
    ],
  },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const growLine = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const Panel = styled('section')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  minHeight: 0,
  overflow: 'hidden',
  color: '#ffffff',
  fontFamily: 'Nunito, Roboto, Helvetica, Arial, sans-serif',
  background: 'rgba(8, 8, 10, 0.66)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '28px',
  boxShadow: '0 30px 70px rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  animation: `${slideIn} 0.9s ${EASING} 0.15s both`,
  [theme.breakpoints.down('md')]: {
    height: 'min(72dvh, 600px)',
    borderRadius: '22px',
  },
  [theme.breakpoints.down('sm')]: {
    height: 'min(70dvh, 560px)',
    borderRadius: '18px',
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const TabList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: '0 0 auto',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5, 2, 0),
  overflowX: 'auto',
  borderBottom: '1px solid rgba(255, 255, 255, 0.14)',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1, 0),
  },
}));

const Tab = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  display: 'flex',
  flex: '0 0 auto',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.25, 2),
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.8rem',
  fontWeight: 800,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
  background: 'transparent',
  border: 'none',
  borderBottom: `3px solid ${active ? '#d40000' : 'transparent'}`,
  transition: 'color 0.3s ease, border-color 0.3s ease',
  '& .tab-index': {
    fontSize: '1rem',
    fontWeight: 900,
    color: 'transparent',
    WebkitTextStroke: `1.5px ${
      active ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'
    }`,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 1.25),
    fontSize: '0.7rem',
    letterSpacing: '0.06em',
    '& .tab-index': {
      display: 'none',
    },
  },
  [HOVER_QUERY]: {
    '&:hover': {
      color: '#ffffff',
    },
  },
  '&:focus-visible': {
    outline: '2px solid #ffffff',
    outlineOffset: '-2px',
  },
}));

const Body = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  padding: theme.spacing(4, 5),
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 2),
  },
}));

const GhostNumber = styled('div')({
  position: 'absolute',
  top: '8px',
  right: '24px',
  fontSize: 'clamp(4.5rem, 12vw, 9rem)',
  fontWeight: 900,
  lineHeight: 0.9,
  color: 'transparent',
  WebkitTextStroke: '2px rgba(255, 255, 255, 0.08)',
  pointerEvents: 'none',
  userSelect: 'none',
});

const BodyInner = styled(Box)({
  position: 'relative',
  animation: `${fadeUp} 0.6s ${EASING} both`,
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
});

const PanelTitle = styled(Typography)({
  fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
  fontWeight: 900,
  lineHeight: 1.05,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: '#ffffff',
});

const PanelLine = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '4px',
  margin: theme.spacing(2, 0, 3),
  borderRadius: '2px',
  backgroundColor: '#d40000',
  transformOrigin: 'left',
  animation: `${growLine} 0.8s ${EASING} 0.2s both`,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1.5, 0, 2),
  },
  [REDUCED_MOTION_QUERY]: {
    animation: 'none',
  },
}));

const Paragraph = styled('p')(({ theme }) => ({
  margin: 0,
  maxWidth: '820px',
  fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
  lineHeight: 1.85,
  color: 'rgba(255, 255, 255, 0.9)',
  [theme.breakpoints.down('sm')]: {
    lineHeight: 1.65,
  },
}));

const ItemList = styled('ul')({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  maxWidth: '820px',
});

const Item = styled('li')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1.5, 0, 1.5, 3),
  fontSize: 'clamp(0.88rem, 1.15vw, 1rem)',
  lineHeight: 1.7,
  color: 'rgba(255, 255, 255, 0.92)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  '&:last-of-type': {
    borderBottom: 'none',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '1.35em',
    left: 0,
    width: '8px',
    height: '8px',
    transform: 'rotate(45deg)',
    backgroundColor: '#d40000',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 0, 1.25, 2.5),
    lineHeight: 1.55,
  },
}));

const EventSection = () => {
  const [activeSection, setActiveSection] = useState(0);
  const current = SECTIONS[activeSection];

  return (
    <Panel>
      <TabList role="tablist" aria-label="Championship details">
        {SECTIONS.map((section, position) => (
          <Tab
            key={section.title}
            type="button"
            role="tab"
            aria-selected={position === activeSection}
            active={position === activeSection}
            onClick={() => setActiveSection(position)}
          >
            <span className="tab-index">
              {String(position + 1).padStart(2, '0')}
            </span>
            {section.title}
          </Tab>
        ))}
      </TabList>

      <Body role="tabpanel">
        <GhostNumber aria-hidden="true">
          {String(activeSection + 1).padStart(2, '0')}
        </GhostNumber>
        <BodyInner key={current.title}>
          <PanelTitle variant="h2">{current.title}</PanelTitle>
          <PanelLine />
          {current.paragraphs &&
            current.paragraphs.map((text) => (
              <Paragraph key={text}>{text}</Paragraph>
            ))}
          {current.items && (
            <ItemList>
              {current.items.map((text) => (
                <Item key={text}>{text}</Item>
              ))}
            </ItemList>
          )}
        </BodyInner>
      </Body>
    </Panel>
  );
};

export default EventSection;
