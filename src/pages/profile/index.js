import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import Box from 'components/ThisBox';
import Footer from 'examples/footer';
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import ParentContainer from 'components/ThisContainer/filtered';
import Header from 'pages/profile/components/Header';

import {useAuth} from 'authContext';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_1.webp';
import background from 'assets/images/tigers_ai/tigersTeamCar_7.webp';
import avatarImg from 'assets/images/logos/logoGray.png';

import AnimatedItem from 'utils/animatedItem';

function Profile() {
  const {accessToken} = useAuth();

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
      const response = await axios.get(
          process.env.REACT_APP_CURRENT_USER_ENDPOINT,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
      );
      const data = response.data;
      setProfileData({
        firstName: data.first_name,
        lastName: data.last_name,
        userName: data.user_name,
        mobileNumber: data.phone_number,
        email: data.email,
        credit: `${data.credit} JOD`,
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

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
          functions: {linearGradient, rgba},
          palette: {gradients},
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
                  <Grid item xs={12} md={6} xl={4} sx={{display: 'flex'}}>
                    <Divider orientation="vertical" sx={{ml: -2, mr: 1}} />
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
                      action={{route: '', tooltip: 'Edit Profile'}}
                      shadow={false}
                    />
                    <Divider orientation="vertical" sx={{mx: 0}} />
                  </Grid>
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
