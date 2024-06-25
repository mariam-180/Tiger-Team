import React from 'react';
import { Box, Container, Grid, Typography, Divider } from '@mui/material';
import SocialMediaIcons from 'examples/socialMediaIcons';

const Footer = () => {
  return (
    <Box
      px={{ xs: 6, sm: 10 }}
      py={{ xs: 6, sm: 10 }}
      color="#C0C0C0"
      sx={{
        backgroundImage: 'linear-gradient(135deg, #A50000 10%, black 100%)',
        backgroundSize: 'cover',
        borderTopLeftRadius: '30% 50%',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              color="#FFFFFF"
            >
              About us
            </Typography>
            <Divider
              style={{
                backgroundColor: '#C0C0C0',
                width: 'fit-content',
                marginBottom: '16px',
              }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Welcome to Tigers Team, your gateway to the ultimate racing
              simulation experience. Since our inception in Jordan in 2012,
              we&apos;ve dedicated ourselves to providing affordable,
              high-quality drifting simulations. Our expert team is committed to
              enhancing your e-gaming journey with custom rigs, professional
              training, and exceptional support. Dive into the world of drifting
              with Tigers Team, where passion and innovation drive every turn.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#FFFFFF"
            >
              Contact us
            </Typography>
            <Divider
              style={{ backgroundColor: '#C0C0C0', marginBottom: '16px' }}
            />
            <Typography variant="subtitle2" gutterBottom>
              Contact us if need help with anything
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              (962) 797544751
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              info@tigers-team.com
            </Typography>
            <SocialMediaIcons />
          </Grid>
        </Grid>
        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
          @ 2024 TigersTeam
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
