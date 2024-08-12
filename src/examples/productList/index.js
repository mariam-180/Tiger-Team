import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductCard from 'examples/Cards/ProductCard';

const ProductList = ({ products, category }) => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '8vh',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: 'white',
          padding: 2,
          borderRadius: 1,
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
          sx={{
            textAlign: 'left',
            fontWeight: 'bold',
            fontSize: '1.8rem',
            letterSpacing: '0.05em',
            color: '#ffffff',
          }}
        >
          {category}
        </Typography>
      </Box>

      <Grid
        container
        spacing={3}
        sx={{
          padding: 3,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
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
  products: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      stock: PropTypes.number.isRequired,
      isLowestPrice: PropTypes.bool,
      link: PropTypes.string.isRequired,
      onAddToCart: PropTypes.func,
    }),
  ).isRequired,
  category: PropTypes.string.isRequired,
};

export default ProductList;
