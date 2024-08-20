import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grow,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ShoppingCartOutlined from '@mui/icons-material/AddShoppingCartTwoTone';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

const ProductDetailsModal = ({ open, onClose, product, onAddToCart }) => {
  useEffect(() => {
    const modalElement = document.querySelector('#modal-element');

    if (open) {
      disableBodyScroll(modalElement);
    } else {
      enableBodyScroll(modalElement);
    }

    return () => {
      clearAllBodyScrollLocks();
    };
  }, [open]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="product-details-title"
      aria-describedby="product-details-description"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(8px) brightness(0.5)',
      }}
    >
      <Grow in={open} timeout={700}>
        <Box
          sx={{
            width: '75vw',
            height: '70vh',
            maxWidth: '700px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: 24,
            padding: 1.5,
            position: 'relative',
            boxShadow: '0px 4px 10px rgba(255, 255, 255, 1)',
            background: 'rgba(255, 255, 255, 0.9)',
            overflowY: 'auto',
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: 'primary.main',
              borderRadius: '40%',
              padding: '8px',
              minWidth: 'auto',
              minHeight: 'auto',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                color: 'error.main',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'start',
              gap: 2,
              paddingBottom: '70px',
            }}
          >
            <Box
              component="img"
              src={product.img_url}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                borderRadius: '16px',
                marginBottom: 2,
                objectFit: 'cover',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.8)',
              }}
            />
            <Box sx={{ width: '100%', padding: 2 }}>
              <Typography
                id="product-details-title"
                variant="h4"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                {product.name}
              </Typography>
              {product.showPrice && (
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'medium',
                    marginTop: 1,
                    color: 'rgba(70, 190, 100, 0.9)',
                  }}
                >
                  Price: {product.price} JOD
                </Typography>
              )}
              <Typography
                id="product-details-description"
                variant="body1"
                paragraph
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                {product.description}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<ShoppingCartOutlined />}
            onClick={() => {
              onClose();
              onAddToCart();
            }}
            sx={{
              position: 'relative',
              bottom: '15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '50%',
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
              transition: 'all 0.3s ease-in-out',
              justifyContent: 'center',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(0, 0, 200, 0.5) !important',
                filter: 'drop-shadow(0px 18px 10px rgba(0, 0, 0, 1))',
              },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Grow>
    </Modal>
  );
};

ProductDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img_url: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    showPrice: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductDetailsModal;
