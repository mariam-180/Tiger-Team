import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductCard from 'examples/Cards/ProductCard';
import bg from 'assets/images/backGround/red_blackBG.webp';

const ProductList = ({ id, products, category }) => {
  return (
    <>
      <Box
        id={id}
        sx={{
          width: '100%',
          height: '8vh',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          filter: 'drop-shadow(8px 10px 1px rgba(255, 0, 0, 0.3))',
          color: 'white',
          padding: 2,
          borderRadius: 0,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          component="div"
          id={id}
          sx={{
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            letterSpacing: '0.05em',
            color: '#ffffff',
            filter: 'drop-shadow(-2px -2px 2px rgba(255, 0, 0, 0.7))',
          }}
        >
          {category}
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          padding: 4,
          position: 'relative',
          zIndex: 0,
          justifyContent: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5) blur(5px)',
            zIndex: -1,
          },
        }}
      >
        {products.map((product, index) => (
          <Grid item key={index} xs={6} md={4} lg={3}>
            <ProductCard {...product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

ProductList.propTypes = {
  id: PropTypes.string,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      img_url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      stock_quantity: PropTypes.number.isRequired,
      isLowestPrice: PropTypes.bool,
      link: PropTypes.string,
      onAddToCart: PropTypes.func,
    }),
  ).isRequired,
  category: PropTypes.string.isRequired,
};

export default ProductList;
