import React, { useState } from 'react';
import PropTypes from 'prop-types';
import productSurface from 'utils/productSurface';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductCard from 'examples/Cards/ProductCard';

const ProductList = ({ id, products, category, onBrowseCategories }) => {
  const [visibleCount, setVisibleCount] = useState(12);
  return (
    <Box
      component="section"
      id={id}
      sx={{
        boxSizing: 'border-box',
        width: '100%',
        minHeight: '100vh',
        '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
        flexShrink: 0,
        paddingTop: { xs: 3, md: 3 },
        scrollMarginTop: 0,
        ...productSurface,
      }}
    >
      <Box
        sx={{
          maxWidth: '1440px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 2 },
          mb: 1,
        }}
      >
        <Typography
          sx={{
            color: '#ed6975',
            fontSize: '0.65rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          Tigers Team / Racing equipment
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: '#fff',
              fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              overflowWrap: 'anywhere',
              minWidth: 0,
            }}
          >
            {category}
          </Typography>
          <Typography
            sx={{
              color: '#b9b9c6',
              border: '1px solid #36363e',
              borderRadius: '100px',
              px: 1.5,
              py: 0.5,
              fontSize: '0.72rem',
              flexShrink: 0,
            }}
          >
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: 2,
            height: '1px',
            bgcolor: '#292930',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: 64,
              height: 3,
              top: -1,
              bgcolor: '#c71929',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: 3,
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '1440px',
          mx: 'auto',
          padding: { xs: 2, md: 4 },
          position: 'relative',
          zIndex: 0,
          justifyContent: 'center',
          alignItems: 'start',
          overflow: 'hidden',
        }}
      >
        {products.length === 0 && (
          <Box
            sx={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '24px',
              border: '1px solid #36303a',
              background:
                'radial-gradient(ellipse at top, rgba(165,20,38,0.12), transparent 70%), #111116',
              px: { xs: 2, sm: 4 },
              py: { xs: 5, md: 7 },
              overflowWrap: 'anywhere',
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                width: 64,
                height: 64,
                border: '1px solid #70313d',
                borderRadius: '18px',
                display: 'grid',
                placeItems: 'center',
                color: '#ef727b',
                fontSize: '2rem',
                mb: 3,
                transform: 'rotate(-8deg)',
              }}
            >
              ?
            </Box>
            <Typography
              sx={{
                color: '#ef727b',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              Nothing on the grid yet
            </Typography>
            <Typography
              component="h3"
              sx={{
                color: '#fff',
                fontSize: 'clamp(1.3rem, 3vw, 2rem)',
                fontWeight: 900,
                mb: 1.5,
              }}
            >
              No products in {category} yet
            </Typography>
            <Typography
              sx={{
                color: '#a9a9b8',
                fontSize: '0.9rem',
                maxWidth: 420,
                lineHeight: 1.7,
              }}
            >
              Explore another category to find your next racing upgrade.
            </Typography>
            {onBrowseCategories && (
              <Button
                onClick={onBrowseCategories}
                sx={{
                  mt: 3,
                  px: 3,
                  py: 1.4,
                  borderRadius: '10px',
                  border: '1px solid #c71929',
                  color: '#fff',
                  '&:hover': {
                    color: '#ef727b',
                    bgcolor: 'rgba(199,25,41,0.1)',
                  },
                }}
              >
                Explore categories
              </Button>
            )}
          </Box>
        )}
        {products.slice(0, visibleCount).map((product) => (
          <Box
            key={product.id}
            sx={{ minWidth: 0, '& > .top': { height: '100%' } }}
          >
            <ProductCard
              img_url={product.img_url}
              name={product.name}
              category={category}
              price={product.price}
              stock_quantity={product.stock_quantity}
              availability={product.availability}
              show_stock_quantity={product.show_stock_quantity}
              isLowestPrice={product.isLowestPrice ?? product.is_lowest_price}
              link={product.link}
              description={product.description}
              onAddToCart={product.onAddToCart}
            />
          </Box>
        ))}
      </Box>
      {visibleCount < products.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 4 }}>
          <Button
            onClick={() => setVisibleCount((count) => count + 12)}
            sx={{ color: '#fff', border: '1px solid #c71929', px: 3, py: 1.5 }}
          >
            Show more ({products.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
};

ProductList.propTypes = {
  onBrowseCategories: PropTypes.func,
  id: PropTypes.string,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      img_url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
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
