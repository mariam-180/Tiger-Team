import { stockLimit } from 'utils/cartStock.mjs';
import React, { useRef, useState } from 'react';
import { useAuth } from 'authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoginRequired } from 'context/LoginRequiredContext';

import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { useSnackbar } from 'context/SnackbarContext';
import cartFallbackImage from 'assets/images/BUNDLES/1/R3-Racing-Wheel-and-Pedals-2.webp';
import { getProductImageUrl } from 'utils/productImage';

function getPrice(price) {
  if (typeof price === 'string') {
    return Number(price.replace(/,/g, ''));
  }
  return price;
}

function CartModal({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveAll,
  setCart,
  fetchCategoriesAndProducts,
}) {
  const { showSnackbar } = useSnackbar();
  const { accessToken, tokenValid, setRedirectPath } = useAuth();
  const { showLoginRequired } = useLoginRequired();
  const navigate = useNavigate();
  const location = useLocation();

  const [checkingOut, setCheckingOut] = useState(false);
  const checkoutPending = useRef(false);

  if (!isOpen) return null;

  const totalPrice = cart.reduce((total, item) => {
    const numericPrice = getPrice(item.price);
    return total + numericPrice * item.quantity;
  }, 0);

  const requireLogin = (message) => {
    sessionStorage.setItem('productCart', JSON.stringify(cart));
    setRedirectPath(location.pathname + location.search);
    showLoginRequired();
    showSnackbar(message, 'warning');
    onClose();
    navigate('/login-required', { state: { from: location } });
  };

  const handleCheckout = async () => {
    if (checkoutPending.current) return;
    if (!accessToken || !tokenValid) {
      requireLogin('Please log in to complete your checkout.');
      return;
    }
    checkoutPending.current = true;
    setCheckingOut(true);
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
        sessionStorage.removeItem('productCart');
        setCart([]);
        fetchCategoriesAndProducts();
        onClose();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        requireLogin('Your session has expired. Please log in to check out.');
      } else if (error.response?.status === 507) {
        showSnackbar('Insufficient stock available!', 'error');
        onClose();
      } else {
        showSnackbar(
          error.response?.status === 402
            ? 'Insufficient credit to complete this order.'
            : 'Checkout failed. Please try again.',
          'error',
        );
      }
    } finally {
      checkoutPending.current = false;
      setCheckingOut(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="cart-title"
      PaperProps={{
        sx: {
          bgcolor: '#101014',
          color: '#fff',
          backgroundImage: 'none',
          border: '1px solid #34343d',
          borderRadius: '24px',
          m: 1.5,
          width: 'calc(100% - 24px)',
          maxHeight: 'calc(100dvh - 32px)',
          overflowWrap: 'anywhere',
          boxShadow: '0 35px 90px rgba(0,0,0,0.65)',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, sm: 3 },
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          borderBottom: '1px solid #292930',
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#ef727b',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Your next upgrade
          </Typography>
          <Typography
            id="cart-title"
            component="h2"
            sx={{ color: '#fff', fontSize: '1.7rem', fontWeight: 900 }}
          >
            Your cart{' '}
            <Box
              component="span"
              sx={{ color: '#9292a2', fontSize: '0.85rem', ml: 1 }}
            >
              ({cart.reduce((count, item) => count + item.quantity, 0)})
            </Box>
          </Typography>
        </Box>
        <IconButton
          aria-label="Close cart"
          onClick={onClose}
          sx={{
            color: '#fff',
            bgcolor: '#222229',
            '&:hover': { bgcolor: '#b51627' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        {cart.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography
              sx={{
                fontSize: '1.15rem',
                color: '#fff',
                fontWeight: 700,
                mb: 1,
              }}
            >
              Ready for your next upgrade?
            </Typography>
            <Typography sx={{ color: '#a5a5b5', fontSize: '0.9rem' }}>
              Your cart is empty. Explore the categories to find your gear.
            </Typography>
            <Button onClick={onClose} sx={{ mt: 3, color: '#f16b78' }}>
              Explore products
            </Button>
          </Box>
        ) : (
          cart.map((item) => (
            <Box
              key={item.id}
              sx={{
                border: '1px solid #2e2e37',
                bgcolor: '#19191f',
                borderRadius: '16px',
                p: 2,
                mb: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  component="img"
                  src={getProductImageUrl(item.img_url, cartFallbackImage)}
                  alt={item.name}
                  onError={(event) => {
                    if (
                      event.currentTarget.getAttribute('src') !==
                      cartFallbackImage
                    )
                      event.currentTarget.src = cartFallbackImage;
                  }}
                  sx={{
                    width: { xs: 64, sm: 80 },
                    height: { xs: 64, sm: 80 },
                    flexShrink: 0,
                    objectFit: 'contain',
                    bgcolor: '#eeeef1',
                    borderRadius: '10px',
                    p: 0.5,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 750,
                      fontSize: '0.93rem',
                      lineHeight: 1.45,
                      mb: 0.75,
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography sx={{ color: '#aaaabb', fontSize: '0.8rem' }}>
                    JOD {getPrice(item.price).toFixed(2)} each
                  </Typography>
                </Box>
                <IconButton
                  aria-label={`Remove ${item.name} from cart`}
                  disabled={checkingOut}
                  onClick={() => onRemoveAll(item)}
                  sx={{
                    color: '#9b9bad',
                    p: 0.5,
                    '&:hover': { color: '#f16b78' },
                  }}
                >
                  <DeleteForeverIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #3b3b46',
                    borderRadius: '9px',
                  }}
                >
                  <IconButton
                    aria-label={`Decrease quantity of ${item.name}`}
                    size="small"
                    disabled={item.quantity <= 1 || checkingOut}
                    onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                    sx={{
                      color: '#fff',
                      '&.Mui-disabled': { color: '#666673' },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      color: '#fff',
                      minWidth: 32,
                      textAlign: 'center',
                      fontSize: '0.85rem',
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    aria-label={`Increase quantity of ${item.name}`}
                    size="small"
                    disabled={checkingOut || item.quantity >= stockLimit(item)}
                    onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                    sx={{ color: '#fff' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography
                  sx={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}
                >
                  JOD {(getPrice(item.price) * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </DialogContent>
      {cart.length > 0 && (
        <DialogActions
          sx={{
            display: 'block',
            p: { xs: 2.5, sm: 3 },
            borderTop: '1px solid #292930',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography sx={{ color: '#aaaabb' }}>Total</Typography>
            <Typography
              sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900 }}
            >
              JOD {totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            disabled={checkingOut}
            onClick={handleCheckout}
            sx={{
              borderRadius: '10px',
              py: 1.7,
              bgcolor: '#c71929',
              color: '#fff',
              '&:hover': { bgcolor: '#e82a3b' },
              '&.Mui-disabled': { bgcolor: '#57252c', color: '#ccc' },
            }}
          >
            {checkingOut ? 'Placing your order...' : 'Proceed to checkout'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

CartModal.propTypes = {
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      quantity: PropTypes.number.isRequired,
      img_url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  setCart: PropTypes.func,
  fetchCategoriesAndProducts: PropTypes.func,
};

export default CartModal;
