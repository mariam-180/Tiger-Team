import useBackgroundRefresh from 'utils/useBackgroundRefresh';
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
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded';
import fallbackImage from 'assets/images/BUNDLES/1/R3-Racing-Wheel-and-Pedals-2.webp';

import ProductDetailsModal from './ProductDetailsModal';
import ScrollAnimation from 'utils/scrollAnimation';
import { fetchControllers, getControllerByName } from 'utils/controllers';

const ProductCard = ({
  img_url,
  name,
  category,
  price,
  stock_quantity,
  availability,
  show_stock_quantity,
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

  const loadShowPrices = async () => {
    try {
      const controllers = await fetchControllers();
      const showPricesController = getControllerByName(
        controllers,
        'ShowPrices',
      );
      setShowPrice(showPricesController?.value === 'true');
    } catch (error) {
      console.error('Error fetching ShowPrices controller:', error);
    }
  };
  useEffect(() => {
    loadShowPrices();
  }, []);
  useBackgroundRefresh(loadShowPrices);

  const handleViewDetails = () => {
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  return (
    <>
      <ScrollAnimation>
        <Card
          component="article"
          {...otherProps}
          onClick={isMobile && !detailsOpen ? handleViewDetails : undefined}
          sx={{
            position: 'relative',
            width: '100%',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '22px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'linear-gradient(145deg, #1b1b20, #0d0d10)',
            color: '#fff',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
            transition:
              'transform 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
            '@media (hover: hover)': {
              '&:hover': {
                transform: 'translateY(-6px)',
                borderColor: 'rgba(239,45,53,0.65)',
                boxShadow: '0 24px 50px rgba(0,0,0,0.5)',
                '& .product-image': { transform: 'scale(1.045)' },
              },
            },
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&:hover': { transform: 'none' },
              '& .product-image': {
                transition: 'none',
                transform: 'none !important',
              },
            },
            ...otherProps.sx,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              background:
                'radial-gradient(ellipse at center, #fff 35%, #e6e7ea 100%)',
            }}
          >
            <CardMedia
              component="img"
              className="product-image"
              image={img_url}
              alt={name}
              loading="lazy"
              onError={(event) => {
                if (event.currentTarget.getAttribute('src') !== fallbackImage) {
                  event.currentTarget.src = fallbackImage;
                }
              }}
              sx={{
                width: '100%',
                height: 'clamp(140px, 24dvh, 210px)',
                flexShrink: 0,
                objectFit: 'contain',
                boxSizing: 'border-box',
                p: { xs: 2.5, md: 3 },
                transition: 'transform 500ms ease',
              }}
            />
            {isLowestPrice && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  bgcolor: '#b90e1b',
                  color: '#fff',
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                Lowest price
              </Box>
            )}
            <Box
              aria-hidden="true"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30%',
                height: 3,
                bgcolor: '#e32636',
              }}
            />
          </Box>
          <CardContent
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              '&:last-child': { pb: 2 },
            }}
          >
            <Typography
              sx={{
                color: '#ee626c',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              {category}
            </Typography>
            <Typography
              component="h3"
              title={name}
              sx={{
                color: '#f6f6f8',
                fontSize: { xs: '1.05rem', md: '1.15rem' },
                fontWeight: 800,
                lineHeight: 1.4,
                minHeight: '2.8em',
                overflowWrap: 'anywhere',
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {name}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                mb: 2,
              }}
            >
              <Box
                aria-hidden="true"
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor:
                    availability === 'PRE_ORDER'
                      ? '#e3ae55'
                      : stock_quantity > 0
                        ? '#79cfa5'
                        : '#a5a5b0',
                }}
              />
              <Typography sx={{ fontSize: '0.73rem', color: '#b7b7c3' }}>
                {availability === 'PRE_ORDER'
                  ? 'Pre-order'
                  : stock_quantity > 0
                    ? 'In stock'
                    : 'Out of stock'}
                {show_stock_quantity && ` ? ${stock_quantity} available`}
              </Typography>
            </Box>
            {showPrice && (
              <Typography
                component="p"
                sx={{
                  color: '#fff',
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  mb: 2,
                }}
              >
                {new Intl.NumberFormat('en', {
                  maximumFractionDigits: 2,
                }).format(price)}
                <Box
                  component="span"
                  sx={{
                    ml: 0.75,
                    color: '#a0a0ad',
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  JOD
                </Box>
              </Typography>
            )}
            <Box
              sx={{
                mt: 'auto',
                pt: 2,
                display: 'flex',
                gap: 1,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  handleViewDetails();
                }}
                endIcon={
                  <ArrowOutwardRounded sx={{ fontSize: '17px !important' }} />
                }
                sx={{
                  flex: 1,
                  minHeight: 46,
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  transition:
                    'color 180ms ease, border-color 180ms ease, background-color 180ms ease',
                  '&:hover, &:focus-visible': {
                    color: '#ef5364 !important',
                    bgcolor: 'rgba(199,25,41,0.08)',
                    borderColor: '#c71929',
                  },
                }}
              >
                View details
              </Button>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToCart?.();
                }}
                disabled={!onAddToCart}
                aria-label={`Add ${name} to cart`}
                title="Add to cart"
                sx={{
                  minWidth: 48,
                  minHeight: 46,
                  borderRadius: '10px',
                  bgcolor: '#c71929',
                  color: '#fff',
                  '&:hover': { bgcolor: '#ed2939' },
                }}
              >
                <ShoppingCartOutlined sx={{ fontSize: 21 }} />
              </Button>
            </Box>
          </CardContent>
        </Card>
      </ScrollAnimation>
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
    </>
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
  availability: PropTypes.string.isRequired,
  show_stock_quantity: PropTypes.bool.isRequired,
};

export default ProductCard;
