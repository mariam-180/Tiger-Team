import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartModal from './cartModal';
import { useIsMobile } from 'utils/hooks';

function ViewMyCartButton({ cart, onUpdateQuantity, onRemoveAll }) {
  const [showButton, setShowButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvisible, setIsInvisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      const sliderElement = document.getElementById('First_Product_List');
      if (sliderElement) {
        const sliderBottom = sliderElement.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        if (sliderBottom < windowHeight - 400) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewCartClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsInvisible(totalItems === 0);
  }, [totalItems]);

  return (
    <>
      <Button
        variant="contained"
        onClick={handleViewCartClick}
        sx={{
          position: 'fixed',
          bottom: '3%',
          left: isMobile ? '85%' : '95%',
          transform: 'translateX(-50%)',
          width: '70px',
          height: '70px',
          backgroundColor: '#2C3E50',
          color: '#fff',
          borderRadius: '50%',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          transition: 'all 0.5s ease-in-out',
          opacity: showButton && !isModalOpen ? 1 : 0,
          pointerEvents: showButton && !isModalOpen ? 'auto' : 'none',
          transform:
            showButton && !isModalOpen
              ? 'translateX(-50%) scale(1)'
              : 'translateX(-50%) scale(0)',
          '&:hover': {
            backgroundColor: '#34495E',
            color: '#333',
            transform: 'translateX(-50%) scale(1.1)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Badge
          badgeContent={totalItems}
          color="primary"
          invisible={isInvisible}
          sx={{
            '& .MuiBadge-badge': {
              right: -14,
              top: -10,
              backgroundColor: 'red',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 'bold',
              width: '25px',
              height: '25px',
              borderRadius: '50%',
            },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: '32px' }} />
        </Badge>
      </Button>
      <CartModal
        cart={cart}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveAll={onRemoveAll}
      />
    </>
  );
}

ViewMyCartButton.propTypes = {
  cart: PropTypes.array.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired,
};

export default ViewMyCartButton;
