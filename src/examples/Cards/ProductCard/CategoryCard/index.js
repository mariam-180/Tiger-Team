import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const CategoryCard = ({ image, name, link }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
        cursor: 'pointer',
        padding: '15px',
        transition: 'transform 0.3s ease-in-out',
        '&:hover .underline': {
          transform: 'scaleX(1)',
          transformOrigin: 'bottom left',
        },
        '&:hover': {
          '& .img-hover': {
            transform: 'translateY(-5px)',
          },
        },
      }}
    >
      <Box
        component="a"
        href={link}
        sx={{
          borderRadius: '50%',
          overflow: 'hidden',
          width: isLargeScreen ? '168px' : '150px',
          height: isLargeScreen ? '168px' : '150px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s ease-in-out',
        }}
        className="img-hover"
      >
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.8)',
          }}
        />
      </Box>
      <Typography
        component="a"
        href={link}
        variant="h6"
        sx={{
          marginTop: '15px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#f44336',
          fontSize: isLargeScreen ? '1.3rem' : '1.2rem',
          position: 'relative',
          transition: 'color 0.3s ease-in-out, font-size 0.3s ease-in-out',
        }}
        className="text-hover"
      >
        {name}
        <Box
          component="span"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '2px',
            backgroundColor: '#f44336',
            bottom: '-4px',
            left: 0,
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s ease-in-out',
          }}
          className="underline"
        />
      </Typography>
    </Box>
  );
};

CategoryCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default CategoryCard;
