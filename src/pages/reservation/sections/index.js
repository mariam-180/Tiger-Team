import React from 'react';
import {useNavigate} from 'react-router-dom';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import Typography from 'components/ThisTypography';
import StyledContainer from 'components/ThisContainer';

// Images
import SnokardoIMG from 'assets/images/logos/logoBlack.png';
import KeloIMG from 'assets/images/backGround/tigersTeam.png';

// Branch data
const branches = [
  {
    name: 'Al-Kilo Circle',
    image: KeloIMG,
    path: '/Products',
    description: 'Behind auto mall, Amman, Jordan',
  },
  {
    name: 'Snokardo',
    image: SnokardoIMG,
    path: '/Reservations/Snokardo',
    description: 'Al-Madina Al-Monawara, Amman, Jordan',
  },
];

function Reservation() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };
  return (
    <StyledContainer
      noLogo={true}
      sx={{
        minHeight: '60vh',
      }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          // Set the background color to transparent
          backgroundColor: 'transparent',
        }}
      >
        {branches.map((branch, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            onClick={() => handleCardClick(branch.path)}
            sx={{margin: '1rem'}}
          >
            <Card
              sx={{
                'cursor': 'pointer',
                'transition': 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 3,
                },
                'width': '100%',
                'height': '310px',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                width="100%"
                image={branch.image}
                alt={branch.name}
                sx={{width: '100%'}}
              />
              <CardContent sx={{textAlign: 'center'}}>
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
      </Grid>
    </StyledContainer>
  );
}

export default Reservation;
