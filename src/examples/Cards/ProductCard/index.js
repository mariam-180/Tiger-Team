import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import ScrollAnimation from 'utils/scrollAnimation';

const ProductCard = ({
  image,
  name,
  category,
  price,
  stock,
  isLowestPrice,
  link,
  onAddToCart,
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ScrollAnimation>
      <Card
        sx={{
          width: '100%',
          height: isMobile ? '400px' : '450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 8px 20px rgba(0, 255, 255, 0.9)',
          },
          padding: 1,
          ...otherProps.sx,
        }}
        {...otherProps}
      >
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{
            objectFit: 'cover',
            height: '40%',
          }}
        />
        <CardContent sx={{ flexGrow: 1, padding: 1, overflow: 'hidden' }}>
          <Typography variant="body2" color="text.secondary">
            {category}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>
          {isLowestPrice && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="success.main">
                Lowest price
              </Typography>
            </Box>
          )}
          <Typography variant="h6" color="text.primary">
            {price} THB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only <b>{stock}</b> left in stock!
          </Typography>
        </CardContent>
        <Box sx={{ p: 1 }}>
          <Button
            variant="contained"
            onClick={onAddToCart}
            fullWidth
            sx={{
              color: 'rgba(0, 255, 255, 0.7)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.5)',
                color: 'rgba(0, 0, 0, 1)',
              },
            }}
          >
            Add to cart
          </Button>
        </Box>
      </Card>
    </ScrollAnimation>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  isLowestPrice: PropTypes.bool,
  link: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
