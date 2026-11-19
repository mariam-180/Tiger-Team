import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from 'components/ThisBox';
import Typography from 'components/ThisTypography';
import Avatar from 'components/ThisAvatar';
import breakpoints from 'assets/theme/base/breakpoints';

function Header({ children, fullName, avatarImg, backgroundImage }) {
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    window.addEventListener('resize', handleTabsOrientation);

    handleTabsOrientation();

    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  return (
    <Box position="relative" mb={5}>
      <Box
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({
            functions: { rgba, linearGradient },
            palette: { gradients },
          }) =>
            `${linearGradient(
              rgba(gradients.black.main, 0.1),
              rgba(gradients.error.main, 0.8),
            )}, url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '50%',
          overflow: 'hidden',
        }}
      />
      <Card
        sx={{
          position: 'relative',
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar src={avatarImg} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <Box height="100%" mt={0.5} lineHeight={1}>
              <Typography variant="h5" fontWeight="medium">
                {fullName}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {children}
      </Card>
    </Box>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  fullName: PropTypes.string.isRequired,
  avatarImg: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
};

export default Header;
