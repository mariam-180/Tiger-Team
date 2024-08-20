import React from 'react';
import { Box, Grid } from '@mui/material';
import CategoryCard from 'examples/Cards/ProductCard/CategoryCard';
import BundlesIMG from 'assets/images/Categories/Bundles.webp';
import WheelBasesIMG from 'assets/images/Categories/WheelBases.webp';
import SteeringWheelsIMG from 'assets/images/Categories/Steering-Wheels.webp';
import Pedals from 'assets/images/Categories/Pedals.webp';
import Accessories from 'assets/images/Categories/Accessories.webp';
import bg from 'assets/images/backGround/red_blackBG.webp';

import ScrollAnimation from 'utils/scrollAnimation';

const categories = [
  {
    name: 'Bundles',
    image: BundlesIMG,
    link: '#Bundles_Product',
  },
  {
    name: 'Wheel Bases',
    image: WheelBasesIMG,
    link: '#Wheel Bases_Product',
  },
  {
    name: 'Steering Wheels',
    image: SteeringWheelsIMG,
    link: '#Steering Wheels_Product',
  },
  { name: 'Pedals', image: Pedals, link: '#Pedals_Product' },
  { name: 'Accessories', image: Accessories, link: '#Accessories_Product' },
];

const CategoriesSection = () => {
  return (
    <Box
      sx={{
        padding: 2,
        position: 'relative',
        zIndex: 0,
        justifyContent: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2) blur(5px)',
          zIndex: -2,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: -1,
        },
      }}
    >
      <ScrollAnimation>
        <Grid container spacing={5} justifyContent="center">
          {categories.map((category) => (
            <Grid
              item
              key={category.name}
              xs={6}
              sm={6}
              md={4}
              lg={2}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CategoryCard
                image={category.image}
                name={category.name}
                link={category.link}
              />
            </Grid>
          ))}
        </Grid>
      </ScrollAnimation>
    </Box>
  );
};

export default CategoriesSection;
