import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import AdminDashboardContent from './AdminDashboardContent';

function Admin() {
  const [activeSection, setActiveSection] = useState(null);

  const handleSectionClick = (section) => {
    if (section.title === 'Admin') {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <Grid
      container
      direction="row"
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
      <NavBar />
      <Grid item sx={{ flexGrow: 1 }}>
        <Box sx={{ padding: 3, mt: { xs: '10%', md: '0' } }}>
          <AdminDashboardContent
            activeSection={activeSection}
            handleSectionClick={handleSectionClick}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default Admin;
