import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';

import backgroundImage from 'assets/images/backGround/championshipPrivew.jpeg';

const StyledBox = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.325rem',
  },
}));

const ParentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: `url(${backgroundImage}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
  [theme.breakpoints.down('sm')]: {
    backgroundAttachment: 'scroll',
  },
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: `url(${backgroundImage}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.3)',
  },
  [theme.breakpoints.down('lg')]: {
    minHeight: '250vh',
  },
  [theme.breakpoints.up('md')]: {
    minHeight: '230vh',
  },
  [theme.breakpoints.down('md')]: {
    minHeight: '300vh',
  },
  [theme.breakpoints.down('sm')]: {
    minHeight: '260vh',
  },
}));

const EventSection = () => {
  return (
    <ParentContainer>
      <StyledContainer
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(1px) brightness(40%)',
        }}
      >
        <StyledBox
          sx={{
            color: '#FFFFFF',
            fontSize: '1.125rem',
            background: 'transparent',
            filter: 'brightness(120%)',
            fontFamily: 'Nunito, Roboto, Helvetica, Arial, sans-serif',
            padding: {
              xs: '32px 20px',
              sm: '48px 40px',
              md: '64px 80px',
              lg: '64px 120px',
              xl: '64px 203px',
            },
            margin: 'auto',
            maxWidth: '1200px',
            mt: { sm: 0, md: 4, lg: 8 },
            mb: { sm: 0, md: 4, lg: 8 },
            '& .MuiTypography-h5': {
              color: '#D7F301',
            },
            '& .MuiListItem-root': {
              display: 'block',
              color: '#FFFFFF',
              margin: '8px 0px',
              padding: '0px 8px',
              '&::before': {
                content: '"•"',
                color: '#FFFFFF',
                paddingRight: '8px',
                fontSize: 'inherit',
              },
            },
            '& p': {
              color: '#FFFFFF',
              margin: '0px 0px 16px',
            },
          }}
        >
          <Typography variant="h5" component="h1">
            ABOUT
          </Typography>
          <Typography paragraph>
            The inaugural Tigers Team Champion League, a first-of-its-kind
            annual championship in the region, is organized by the Tigers Team
            Center in collaboration with Jordan Speed Center. Scheduled to take
            place on March 1st, 2024, this event is a celebration of drifting
            simulation, designed to challenge and entertain participants and
            spectators alike. With a commitment to inclusivity and excellence,
            the championship will feature a meticulously organized race format,
            including a Tandem Drift event with qualification rounds leading to
            a top 32 competition. It promises to be a landmark event, fostering
            a competitive yet welcoming environment for enthusiasts of all ages.
          </Typography>

          <Typography variant="h5" component="h2">
            REGISTRATION
          </Typography>
          <List sx={{ width: '100%' }}>
            <ListItem>
              Registration is exclusively online through the official website
              and opens one month before the championship.
            </ListItem>
            <ListItem>
              The championship is open to individuals of all ages, with no age
              restrictions.
            </ListItem>
            <ListItem>
              Participation fee: 18 Jordanian Dinars, covering 3 hours of
              training to familiarize participants with the cars.
            </ListItem>
            <ListItem>
              Participants are urged to seek approval swiftly after submitting
              their payment.
            </ListItem>
            <ListItem>
              A briefing meeting for participants will discuss championship
              details and Terms and Conditions after registration closes.
            </ListItem>
          </List>

          <Typography variant="h5" component="h2">
            RACE FORMAT
          </Typography>
          <List sx={{ width: '100%' }}>
            <ListItem>
              First Round: Begins with a Qualifying step, where each participant
              gets two runs to select their best for evaluation. The top 32
              participants advance to the Tandem Drift competition.
            </ListItem>
            <ListItem>
              Subsequent Rounds: Follow the same format as the first, with the
              event culminating in the selection of Jordan&apos;s champion in
              drifting simulation.
            </ListItem>
            <ListItem>
              Vehicles: A limited selection of private drift vehicles will be
              available to participants 15 days before the championship starts.
            </ListItem>
            <ListItem>
              Tracks: Details of the championship track will be unveiled one
              week prior to the event.
            </ListItem>
          </List>

          <Typography variant="h5" component="h2">
            PRIZES
          </Typography>
          <List sx={{ width: '100%' }}>
            <ListItem>1st Place: 400 JD</ListItem>
            <ListItem>2nd Place: 200 JD</ListItem>
            <ListItem>3rd Place: 100 JD</ListItem>
            <ListItem>
              Sponsors may offer additional non-cash prizes for participants and
              spectators.
            </ListItem>
            <ListItem>
              Prizes are awarded on the coronation day, concluding the third
              round.
            </ListItem>
          </List>

          <Typography variant="h5" component="h2">
            GOOD TO KNOW
          </Typography>
          <Typography paragraph>
            The championship will take place at a Tigers Team branch in Amman,
            with the potential for location changes based on the event&apos;s
            scale and participant numbers. Offering opportunities for
            partnerships and sponsorships, this event extends a warm welcome to
            companies interested in supporting a burgeoning sports community.
            Judging will be conducted by a seasoned committee, ensuring the
            championship adheres to international standards. This initiative is
            not just about crowning a champion but nurturing a passionate
            community, offering a platform for skill enhancement and
            sportsmanship in an inclusive setting.
          </Typography>
        </StyledBox>
      </StyledContainer>
    </ParentContainer>
  );
};

export default EventSection;
