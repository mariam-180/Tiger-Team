import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import TransparentBox from 'components/ThisTransparentBox';

const StyledContainer = styled(Box)(({ theme, background }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `url(${background}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    filter: 'blur(8px) brightness(20%)',
  },
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(4),
}));

function Reservation({ handleCardClick, branches, background }) {
  return (
    <StyledContainer background={background}>
      <TransparentBox>
        <Typography variant="h4" component="h1" sx={{ color: 'lightgray' }}>
          Explore our awesome branches and choose your favorite!
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'lightgray', marginTop: '0.5rem' }}
        >
          Each branch has something unique and exciting to offer. Find out more
          below!
        </Typography>
      </TransparentBox>
      <GridContainer container spacing={4} justifyContent="center">
        {branches.map((branch, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            onClick={() => handleCardClick(branch)}
            sx={{ margin: '1rem' }}
          >
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 3,
                },
                width: '100%',
                height: '310px',
                backgroundColor: '#A9A9A9',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                width="100%"
                image={branch.image}
                alt={branch.name}
                sx={{ width: '100%' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography gutterBottom variant="h5" component="div">
                  {branch.name}
                </Typography>
                <Typography variant="body2" color="dark">
                  {branch.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </GridContainer>
    </StyledContainer>
  );
}

Reservation.propTypes = {
  handleCardClick: PropTypes.func.isRequired,
  branches: PropTypes.array.isRequired,
  background: PropTypes.string,
};

export default Reservation;
