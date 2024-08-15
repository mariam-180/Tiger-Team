import React, { useState } from 'react';
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
import ShoppingCartOutlined from '@mui/icons-material/AddShoppingCartTwoTone';

import ProductDetailsModal from './ProductDetailsModal';

import ScrollAnimation from 'utils/scrollAnimation';

const ProductCard = ({
  image,
  name,
  category,
  price,
  stock,
  isLowestPrice,
  link,
  description,
  onAddToCart,
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = () => {
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <ScrollAnimation>
      <Card
        sx={{
          width: '100%',
          height: isMobile ? '400px' : '450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0px 4px 10px rgba(255, 255, 255, 1)',
          background: 'rgba(255, 255, 255, 0.7)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 3px 20px 5px rgba(255, 0, 0, 0.7)',
          },
          padding: 2,
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
        <CardContent
          sx={{
            flexGrow: 1,
            padding: 1,
            overflow: 'hidden',
            marginBottom: isMobile ? 2 : 0,
          }}
        >
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
            {price} JOD
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Only <b>{stock}</b> left in stock!
          </Typography>
        </CardContent>
        <Box
          sx={{
            p: 1,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleViewDetails}
            sx={{
              width: isMobile ? '100%' : '75%',
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(200, 0, 0, 0.7) !important',
                filter: 'drop-shadow(0px 18px 10px rgba(0, 0, 0, 1))',
              },
            }}
          >
            Details
          </Button>
          {!isMobile && (
            <Button
              variant="contained"
              onClick={onAddToCart}
              sx={{
                opacity: isMobile ? 0 : 1,
                width: '25%',
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
                transition: 'all 0.3s ease-in-out',
                justifyContent: 'center',
                padding: 0,
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(0, 0, 200, 0.5) !important',
                  filter: 'drop-shadow(0px 18px 10px rgba(0, 0, 0, 1))',
                },
              }}
            >
              <ShoppingCartOutlined />
            </Button>
          )}
        </Box>
        <ProductDetailsModal
          open={detailsOpen}
          onClose={handleCloseDetails}
          onAddToCart={onAddToCart}
          product={{
            image,
            name,
            category,
            price,
            stock,
            isLowestPrice,
            link,
            description,
          }}
        />
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
  description: PropTypes.string.isRequired,
  isLowestPrice: PropTypes.bool,
  link: PropTypes.string.isRequired,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
