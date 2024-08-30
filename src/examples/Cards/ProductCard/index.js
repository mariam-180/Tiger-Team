/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
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
import { fetchControllers, getControllerByName } from 'utils/controllers';

const ProductCard = ({
  img_url,
  name,
  category,
  price,
  stock_quantity,
  isLowestPrice,
  link,
  description,
  onAddToCart,
  ...otherProps
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showPrice, setShowPrice] = useState(false);

  useEffect(() => {
    const loadShowPrices = async () => {
      try {
        const controllers = await fetchControllers();
        const showPricesController = getControllerByName(
          controllers,
          'ShowPrices',
        );
        if (showPricesController && showPricesController.value === 'true') {
          setShowPrice(true);
        }
      } catch (error) {
        console.error('Error fetching ShowPrices controller:', error);
      }
    };

    loadShowPrices();
  }, []);

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
          padding: 0,
          ...otherProps.sx,
        }}
        {...otherProps}
      >
        <CardMedia
          component="img"
          image={img_url}
          alt={name}
          sx={{
            objectFit: 'contain',
            objectPosition: 'center',
            backgroundColor: '#fff',
            height: '50%',
            padding: 0.5,
          }}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            marginBottom: isMobile ? 2 : 0,
            padding: 1,
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
          {showPrice && (
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 'medium',
                marginTop: 1,
                color: 'primary.main',
              }}
            >
              {price} JOD
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Only <b>{stock_quantity}</b> left in stock!
          </Typography>
        </CardContent>
        <Box
          sx={{
            p: 1,
            display: 'flex',
            gap: 2,
            padding: 1,
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
            img_url,
            name,
            category,
            price,
            showPrice,
            stock_quantity,
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
  img_url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock_quantity: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  isLowestPrice: PropTypes.bool,
  link: PropTypes.string,
  onAddToCart: PropTypes.func,
};

export default ProductCard;
