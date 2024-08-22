/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Grid,
  Divider,
  Button,
  Box,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';

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
import { formatTime } from 'utils/timeUtils';

import EventIcon from '@mui/icons-material/Event';
import ReservationIcon from '@mui/icons-material/Computer';
import OrderIcon from '@mui/icons-material/ShoppingCart';

const sections = [
  {
    id: 'reservations',
    title: 'Reservations',
    icon: <ReservationIcon />,
    color: '#ff7009',
  },
  { id: 'events', title: 'Events', icon: <EventIcon />, color: '#ff7009' },
  { id: 'orders', title: 'Orders', icon: <OrderIcon />, color: '#ff7009' },
];

function Profile() {
  const { accessToken } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const [selectedSection, setSelectedSection] = useState('events');

  const formattedDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 3);
    return newDate.toLocaleString();
  };

  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

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
      } catch (error) {
        console.error('Error fetching reservations data:', error);
      }

      try {
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
        console.error('Error fetching events data:', error);
      }

      try {
        const ordersResponse = await axios.get(
          `${process.env.REACT_APP_ORDER_BY_USERNAME_ENDPOINT}${userData.user_name}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        const ordersData = ordersResponse.data;

        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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

  const orderColumns = [
    { Header: 'Items', accessor: 'items', align: 'left' },
    { Header: 'Status', accessor: 'status', align: 'left' },
    { Header: 'Total Amount', accessor: 'total_amount', align: 'left' },
    { Header: 'Date', accessor: 'date', align: 'left' },
  ];

  const reservationRows = reservations.map((reservation) => ({
    branch_name: reservation.branch_name,
    pc_number: reservation.pc_number,
    reservation_start: formatTime(reservation.reservation_start),
    reservation_end: formatTime(reservation.reservation_end),
    duration: reservation.duration,
    total_cost: reservation.total_cost,
  }));

  const orderRows = orders.map((order) => ({
    status: order.status,
    total_amount: order.total_amount,
    items: (
      <Box>
        <Typography variant="body2">
          {`Total Items: ${order.items.length}`}
        </Typography>
        <Button
          onClick={(event) => handleMenuOpen(event, order.id)}
          sx={{
            textTransform: 'none',
            fontSize: '0.875rem',
            color: '#ff7009 !IMPORTANT',
          }}
        >
          Show
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl) && selectedOrderId === order.id}
          onClose={handleMenuClose}
          sx={{}}
          MenuListProps={{
            sx: {
              display: 'flex',
              overflowX: 'auto',
              flexDirection: 'column',
            },
          }}
        >
          {order.items.map((item, index) => (
            <MenuItem
              key={index}
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              {`${item.product.name} - Quantity: ${item.quantity}`}
              &nbsp;
            </MenuItem>
          ))}
        </Menu>
      </Box>
    ),
    date: formattedDate(order.created_at),
  }));

  const eventRows = [
    {
      event_name: 'Tigers Team',
      registration_time: formatTime(events.registration_time, true),
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
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                        maxWidth: '450px',
                        m: 3,
                        overflowX: 'auto',
                      }}
                    >
                      <Typography
                        variant="h6"
                        onClick={() => setSelectedSection('events')}
                        sx={{
                          paddingRight: 2,
                          cursor: 'pointer',
                          color:
                            selectedSection === 'events'
                              ? 'primary.main'
                              : 'text.primary',
                        }}
                      >
                        Events 🎈
                      </Typography>
                      <Typography
                        variant="h6"
                        onClick={() => setSelectedSection('reservations')}
                        sx={{
                          paddingRight: 2,
                          cursor: 'pointer',
                          color:
                            selectedSection === 'reservations'
                              ? 'primary.main'
                              : 'text.primary',
                        }}
                      >
                        Reservations 🖥️
                      </Typography>
                      <Typography
                        variant="h6"
                        onClick={() => setSelectedSection('orders')}
                        sx={{
                          paddingRight: 2,
                          cursor: 'pointer',
                          color:
                            selectedSection === 'orders'
                              ? 'primary.main'
                              : 'text.primary',
                        }}
                      >
                        Orders 🛒
                      </Typography>
                    </Box>

                    {selectedSection === 'reservations' && (
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
                    )}
                    {selectedSection === 'events' && (
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
                    )}

                    {selectedSection === 'orders' && (
                      <AnimatedItem>
                        <DynamicTable
                          title="Orders"
                          columns={orderColumns}
                          rows={orderRows}
                          isSorted={false}
                          canSearch={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                      </AnimatedItem>
                    )}
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
