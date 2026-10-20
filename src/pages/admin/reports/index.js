import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const AdminPage = () => {
  const endpointUrl = process.env.REACT_APP_ADMIN_REPORTS_URL;

  return (
    <Box sx={{ p: 4, minHeight: '60vh', color: 'white' }}>
      <Typography variant="h1" sx={{ fontSize: '2rem', mb: 2 }}>
        Reports
      </Typography>
      <Typography sx={{ mb: 3 }}>
        Review operational reports and traffic analytics for Tigers Team.
      </Typography>
      {endpointUrl ? (
        <Button
          component="a"
          href={endpointUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
        >
          Open reports
        </Button>
      ) : (
        <Typography color="text.secondary">
          The external reporting service is not configured in this environment.
        </Typography>
      )}
    </Box>
  );
};

export default AdminPage;
