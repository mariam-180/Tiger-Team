/* eslint-disable react/prop-types */
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Box, Typography } from '@mui/material';

import backgroundImage from 'assets/images/backGround/adminPage.webp';
import { sections } from 'adminRoutes';

const AdminDashboardContent = () => {
  const navigate = useNavigate();

  const handleSectionClick = (section) => {
    navigate(section.route);
  };

  return (
    <Grid
      container
      spacing={4}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        paddingTop: '10vh',
        '&::before': {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px) brightness(0.3)',
          content: '""',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        },
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{
          textAlign: 'center',
          padding: 4,
          maxWidth: '1200px',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {sections.map((section, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Box
              onClick={() => handleSectionClick(section)}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                padding: 4,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 20px rgba(255, 0, 0, 0.4)',
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                width: '100%',
                maxWidth: {
                  xs: '300px',
                  sm: '300px',
                  md: '400px',
                  lg: 'auto',
                  xl: 'auto',
                },
              }}
            >
              <Box sx={{ color: section.color }}>
                {React.cloneElement(section.icon, { sx: { fontSize: 50 } })}
              </Box>
              <Typography variant="h6" sx={{ mt: 2, color: '#ffffff' }}>
                {section.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default AdminDashboardContent;
