/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React from 'react';

import {Grid} from '@mui/material';
import Box from 'components/ThisBox';
import Avatar from 'components/ThisAvatar';
import Typography from 'components/ThisTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DynamicTable from 'components/ThisEnhancedTable';

import NavBar from 'examples/navbars/DefaultNavbar';
import ParentContainer from 'components/ThisContainer/filtered';
import Footer from 'examples/footer';

import background from 'assets/images/tigers_ai/tigersTeamCar_9.webp';
import team2 from 'assets/images/tigers_ai/tigersTeamCar_6.webp';

function QA() {
  const Author = ({image, name, email}) => (
    <Box display="flex" alignItems="center" lineHeight={1}>
      <Avatar src={image} name={name} size="sm" />
      <Box ml={2} lineHeight={1}>
        <Typography display="block" variant="button" fontWeight="medium">
          {name}
        </Typography>
        <Typography variant="caption">{email}</Typography>
      </Box>
    </Box>
  );

  const columns = [
    {Header: 'Author', accessor: 'author', width: '45%', align: 'left'},
    {Header: 'Username', accessor: 'user_name', align: 'left'},
    {Header: 'Credit', accessor: 'credit', align: 'center'},
    {Header: 'Role', accessor: 'role', align: 'center'},
    {Header: 'Action', accessor: 'action', align: 'center'},
  ];

  const rows = [
    {
      author: (
        <Author
          image={team2}
          name="John Michael"
          email="john@creative-tim.com"
        />
      ),
      user_name: (
        <Typography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          TEST
        </Typography>
      ),
      action: (
        <Typography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          Edit
        </Typography>
      ),
    },
    {
      author: (
        <Author
          image={team2}
          name="Aohn Michael"
          email="john@creative-tim.com"
        />
      ),
      user_name: (
        <Typography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          A
        </Typography>
      ),
      action: (
        <Typography
          component="a"
          href="#"
          variant="caption"
          color="text"
          fontWeight="medium"
        >
          Edit
        </Typography>
      ),
    },
  ];

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#000',
        backgroundimage: ({
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
      <NavBar />
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
          <Box
            sx={{
              width: {
                xs: '90vw',
                sm: '92vw',
                md: '94vw',
                xl: '95.5vw',
              },
            }}
          >
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <DynamicTable
                  title="Authors Table"
                  columns={columns}
                  rows={rows}
                />
              </Grid>
            </Grid>
          </Box>
        </DashboardLayout>
      </ParentContainer>
      <Footer />
    </Grid>
  );
}

export default QA;
