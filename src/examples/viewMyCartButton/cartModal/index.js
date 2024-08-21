import React, { useEffect } from 'react';
import { useAuth } from 'authContext';

import PropTypes from 'prop-types';
import { Box, Typography, Button, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { useSnackbar } from 'context/SnackbarContext';

function getPrice(price) {
  if (typeof price === 'string') {
    return Number(price.replace(/,/g, ''));
  }
  return price;
}

function CartModal({ cart, isOpen, onClose, onUpdateQuantity, onRemoveAll }) {
  const { showSnackbar } = useSnackbar();
  const { accessToken } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalPrice = cart.reduce((total, item) => {
    const numericPrice = getPrice(item.price);
    return total + numericPrice * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_ORDERS_ENDPOINT,
        {
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: getPrice(item.price),
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            history: true,
          },
        },
      );
      if (response.status === 201) {
        showSnackbar('Checkout successful!', 'success');
        onClose();
      }
    } catch (error) {
      if (error.response.status === 507) {
        showSnackbar('Insufficient stock available!', 'error');
        onClose();
      } else {
        showSnackbar('Checkout failed. Please try again.', 'error');
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          borderRadius: '20px',
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          p: 4,
          maxHeight: '70vh',
          minHeight: '20vh',
          overflowY: 'auto',
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: 'primary.main',
            borderRadius: '30%',
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
        </Button>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
            color: 'primary.main',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          🛒 Your Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          cart.map((item, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  component="img"
                  src={item.img_url}
                  alt={item.name}
                  sx={{ width: 50, height: 50, borderRadius: '8px', mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    JOD {getPrice(item.price).toFixed(0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    sx={{ color: 'error.main' }}
                    disabled={item.quantity === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" sx={{ mx: 2 }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    sx={{ color: 'primary.main' }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onRemoveAll(item)}
                    sx={{ color: 'error.main', ml: 1 }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Total:
                </Typography>
                <Typography variant="body2">
                  JOD {(getPrice(item.price) * item.quantity).toFixed(0)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))
        )}
        {cart.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">JOD {totalPrice.toFixed(0)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                backgroundColor: 'rgba(0, 0, 0, 0.7) !important',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'rgba(139, 0, 0, 0.7)  !important',
                  filter: 'drop-shadow(0px 10px 15px rgba(0, 0, 0, 1))',
                },
              }}
            >
              Checkout
            </Button>
          </>
        )}
      </Box>
    </>
  );
}

CartModal.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      img_url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
};

export default CartModal;
