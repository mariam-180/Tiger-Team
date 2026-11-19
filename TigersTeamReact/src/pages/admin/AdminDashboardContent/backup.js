/* eslint-disable react/prop-types */
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { sections } from 'adminRoutes';

const AdminDashboardContent = ({ activeSection, handleSectionClick }) => {
  return (
    <Grid
      container
      spacing={4}
      sx={{
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {activeSection === null ? (
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{
            textAlign: 'center',
            padding: 4,
            margin: 'auto',
            maxWidth: '1200px',
          }}
        >
          {sections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
              <Box
                onClick={() => handleSectionClick(section)}
                sx={{
                  backgroundColor: '#1c1c1c',
                  color: '#fff',
                  padding: 4,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                }}
              >
                <Box sx={{ fontSize: 50, color: section.color }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ mt: 2, color: '#ffffff' }}>
                  {section.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>{activeSection.component}</>
      )}
    </Grid>
  );
};

export default AdminDashboardContent;
