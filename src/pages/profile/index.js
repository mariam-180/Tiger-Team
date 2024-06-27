import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import Box from 'components/ThisBox';
import Footer from 'examples/footer';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import ParentContainer from 'components/ThisContainer/filtered';
import DynamicTable from 'components/ThisEnhancedTable';
import Header from 'pages/profile/components/Header';

import { useAuth } from 'authContext';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_1.webp';
import background from 'assets/images/tigers_ai/tigersTeamCar_7.webp';
import avatarImg from 'assets/images/logos/logoGray.png';

import AnimatedItem from 'utils/animatedItem';

function Profile() {
  const { accessToken } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    mobileNumber: '',
    email: '',
    credit: '',
  });

  const fetchData = async () => {
    try {
      const userResponse = await axios.get(
        process.env.REACT_APP_CURRENT_USER_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const userData = userResponse.data;

      setProfileData({
        firstName: userData.first_name,
        lastName: userData.last_name,
        userName: userData.user_name,
        mobileNumber: userData.phone_number,
        email: userData.email,
        credit: `${userData.credit} JOD`,
      });

      try {
        const reservationsResponse = await axios.get(
          `${process.env.REACT_APP_USER_RESERVATIONS_ENDPOINT}${userData.user_name}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const reservationsData = reservationsResponse.data;

        if (!reservationsData || reservationsData.length === 0) {
          throw new Error('No reservations found');
        }

        setReservations(reservationsData);

        const eventsResponse = await axios.get(
          `${process.env.REACT_APP_REGISTRATION_BY_EMAIL_ENDPOINT}${userData.email}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const eventsData = eventsResponse.data;

        if (!eventsData || eventsData.length === 0) {
          throw new Error('No events found');
        }
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const reservationColumns = [
    { Header: 'Branch Name', accessor: 'branch_name', align: 'left' },
    { Header: 'PC Number', accessor: 'pc_number', align: 'left' },
    {
      Header: 'Reservation Start',
      accessor: 'reservation_start',
      align: 'left',
    },
    { Header: 'Reservation End', accessor: 'reservation_end', align: 'left' },
    { Header: 'Duration', accessor: 'duration', align: 'left' },
    { Header: 'Total Cost', accessor: 'total_cost', align: 'left' },
  ];

  const eventColumns = [
    { Header: 'Event Name', accessor: 'event_name', align: 'left' },
    {
      Header: 'Registration time',
      accessor: 'registration_time',
      align: 'left',
    },
    { Header: 'Status', accessor: 'status', align: 'left' },
  ];

  function formatRegistrationTime(isoDateString) {
    const date = new Date(isoDateString);
    date.setHours(date.getHours() + 3);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Amman',
    });
  }

  const reservationRows = reservations.map((reservation) => ({
    branch_name: reservation.branch_name,
    pc_number: reservation.pc_number,
    reservation_start: reservation.reservation_start,
    reservation_end: reservation.reservation_end,
    duration: reservation.duration,
    total_cost: reservation.total_cost,
  }));

  const eventRows = [
    {
      event_name: 'Tigers Team',
      registration_time: formatRegistrationTime(events.registration_time),
      status: events.status,
    },
  ];

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const fullName = `${profileData.firstName} ${profileData.lastName}`;

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
          functions: { linearGradient, rgba },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.01),
            rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <ParentContainer
        blur={2}
        brightness={20}
        backgroundImage={background}
        sx={{
          padding: '',
          alignItems: '',
        }}
      >
        <DashboardLayout>
          <Box mb={2} />
          <AnimatedItem>
            <Header
              fullName={fullName}
              avatarImg={avatarImg}
              backgroundImage={backgroundImage}
            >
              <Box mt={5} mb={3}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} xl={4} sx={{ display: 'flex' }}>
                    <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                    <ProfileInfoCard
                      title="profile information"
                      description={`Hello ${profileData.firstName},
                      to add credit to your account,
                      please visit one of our branches and
                      complete the transaction with a cash payment.
                      Thank you!.`}
                      info={{
                        userName: profileData.userName,
                        fullName,
                        mobile: profileData.mobileNumber,
                        email: profileData.email,
                        credit: profileData.credit,
                      }}
                      social={[]}
                      action={{ route: '', tooltip: 'Edit Profile' }}
                      shadow={false}
                    />
                    <Divider orientation="vertical" sx={{ mx: 0 }} />
                  </Grid>
                  <Box
                    sx={{
                      maxWidth: {
                        xs: '70vw',
                        sm: '75vw',
                        md: '80vw',
                        xl: '50vw',
                      },
                      marginTop: {
                        xs: '30px',
                        sm: '30px',
                        md: '30px',
                        xl: '10px',
                      },
                      marginLeft: {
                        md: '0',
                        xl: '20px',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    <AnimatedItem>
                      <DynamicTable
                        title="Reservations"
                        columns={reservationColumns}
                        rows={reservationRows}
                        isSorted={false}
                        canSearch={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    </AnimatedItem>
                    <AnimatedItem>
                      <DynamicTable
                        title="Events"
                        columns={eventColumns}
                        rows={eventRows}
                        isSorted={false}
                        canSearch={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                      />
                    </AnimatedItem>
                  </Box>
                </Grid>
              </Box>
            </Header>
          </AnimatedItem>
        </DashboardLayout>
      </ParentContainer>
      <Footer />
    </Grid>
  );
}

export default Profile;
