import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartOutlined from '@mui/icons-material/AddShoppingCartTwoTone';
import fallbackImage from 'assets/images/BUNDLES/1/R3-Racing-Wheel-and-Pedals-2.webp';

const ProductDetailsModal = ({ open, onClose, product, onAddToCart }) => (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="md"
    aria-labelledby="product-details-title"
    aria-describedby="product-details-description"
    PaperProps={{
      sx: {
        m: { xs: 1.5, sm: 3 },
        width: { xs: 'calc(100% - 24px)', sm: 'calc(100% - 48px)' },
        maxHeight: 'calc(100dvh - 32px)',
        borderRadius: { xs: '20px', md: '28px' },
        bgcolor: '#101014',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.15)',
        backgroundImage: 'none',
        boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
        overflowWrap: 'anywhere',
      },
    }}
  >
    <IconButton
      aria-label="Close product details"
      onClick={onClose}
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 2,
        bgcolor: '#19191f',
        color: '#fff',
        border: '1px solid #42424a',
        '&:hover': { bgcolor: '#b51627' },
      }}
    >
      <CloseIcon />
    </IconButton>
    <DialogContent sx={{ p: 0 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0,1fr)',
            md: 'minmax(0,1fr) minmax(0,1fr)',
          },
        }}
      >
        <Box
          sx={{
            bgcolor: '#ededf0',
            p: { xs: 3, md: 4 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: { md: 380 },
          }}
        >
          <Box
            component="img"
            src={product.img_url}
            alt={product.name}
            onError={(event) => {
              if (event.currentTarget.getAttribute('src') !== fallbackImage)
                event.currentTarget.src = fallbackImage;
            }}
            sx={{
              width: '100%',
              maxHeight: { xs: '28dvh', md: 400 },
              objectFit: 'contain',
            }}
          />
        </Box>
        <Box sx={{ p: { xs: 3, md: 4 }, pt: { md: 7 }, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: '#ef727b',
              textTransform: 'uppercase',
              fontWeight: 800,
              mb: 1.5,
            }}
          >
            {product.category || 'Tigers Team Racing'}
          </Typography>
          <Typography
            id="product-details-title"
            component="h2"
            sx={{
              fontSize: 'clamp(1.4rem, 3vw, 2.1rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#fff',
              mb: 2,
            }}
          >
            {product.name}
          </Typography>
          {product.isLowestPrice && (
            <Typography
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                color: '#ffabb2',
                bgcolor: 'rgba(199,25,41,0.15)',
                fontSize: '0.7rem',
                mb: 2,
              }}
            >
              Lowest price
            </Typography>
          )}
          {product.showPrice && (
            <Typography
              sx={{ fontSize: '2rem', fontWeight: 900, color: '#fff', mb: 2 }}
            >
              {new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(
                product.price,
              )}{' '}
              <Box
                component="span"
                sx={{
                  fontSize: '0.75rem',
                  color: '#aaaab7',
                  letterSpacing: '0.1em',
                }}
              >
                JOD
              </Box>
            </Typography>
          )}
          <Box sx={{ width: 40, height: 3, bgcolor: '#c71929', mb: 2.5 }} />
          <Typography
            sx={{
              color: '#fff',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 800,
              mb: 1,
            }}
          >
            Product details
          </Typography>
          <Typography
            id="product-details-description"
            sx={{
              color: '#b9b9c6',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {product.description || 'More details will be available soon.'}
          </Typography>
        </Box>
      </Box>
    </DialogContent>
    <DialogActions
      sx={{
        p: { xs: 2, sm: 3 },
        borderTop: '1px solid #292930',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Button
        onClick={onClose}
        sx={{ color: '#b9b9c6', '&:hover': { color: '#f04b59' } }}
      >
        Continue browsing
      </Button>
      <Button
        variant="contained"
        startIcon={<ShoppingCartOutlined />}
        disabled={!onAddToCart}
        onClick={() => {
          onAddToCart?.();
          onClose();
        }}
        sx={{
          bgcolor: '#c71929',
          color: '#fff',
          borderRadius: '10px',
          px: 3,
          py: 1.5,
          '&:hover': { bgcolor: '#e82a3b' },
        }}
      >
        Add to cart
      </Button>
    </DialogActions>
  </Dialog>
);

ProductDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    img_url: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    showPrice: PropTypes.bool,
    category: PropTypes.string,
    isLowestPrice: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func,
};
export default ProductDetailsModal;
