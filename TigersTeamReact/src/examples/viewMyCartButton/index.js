import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Badge, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartModal from './cartModal';
import { useIsMobile } from 'utils/hooks';

function ViewMyCartButton({
  cart,
  onUpdateQuantity,
  onRemoveAll,
  setCart,
  fetchCategoriesAndProducts,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleViewCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {!isModalOpen && (
        <Button
          variant="contained"
          onClick={handleViewCartClick}
          aria-label={`View cart (${totalItems} items)`}
          sx={{
            position: 'fixed',
            bottom: 'max(20px, env(safe-area-inset-bottom))',
            right: isMobile ? '16px' : '3%',
            minWidth: isMobile ? 60 : 140,
            height: '60px',
            gap: 2,
            backgroundColor: '#17171e',
            border: '1px solid #c71929',
            color: '#fff',
            borderRadius: '18px',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            transition: 'background-color 200ms ease, transform 200ms ease',
            '@media (prefers-reduced-motion: reduce)': {
              transition: 'none',
              '&:hover': { transform: 'none' },
            },
            '&:hover': {
              backgroundColor: '#a91122',
              color: '#fff',
              transform: 'translateY(-3px)',
              boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <Badge
            badgeContent={totalItems}
            color="primary"
            invisible={totalItems === 0}
            sx={{
              '& .MuiBadge-badge': {
                right: -5,
                top: -3,
                backgroundColor: '#c71929',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                minWidth: '20px',
                height: '20px',
                padding: '0 5px',
                borderRadius: '50%',
              },
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: '26px' }} />
          </Badge>
          {!isMobile && (
            <Typography
              component="span"
              sx={{
                color: 'inherit',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            >
              Your cart
            </Typography>
          )}
        </Button>
      )}
      <CartModal
        cart={cart}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveAll={onRemoveAll}
        setCart={setCart}
        fetchCategoriesAndProducts={fetchCategoriesAndProducts}
      />
    </>
  );
}

ViewMyCartButton.propTypes = {
  cart: PropTypes.array.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
  setCart: PropTypes.func,
  fetchCategoriesAndProducts: PropTypes.func,
};

export default ViewMyCartButton;
