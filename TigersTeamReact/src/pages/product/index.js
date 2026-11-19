import {
  stockLimit,
  cartQuantity,
  setCartQuantity,
  reconcileCartStock,
} from 'utils/cartStock.mjs';
import LoadingScreen from 'components/LoadingScreen';
import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import productSurface from 'utils/productSurface';
import { Alert, Button, Grid, Typography } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import ProductList from 'examples/productList';
import ViewMyCartButton from 'examples/viewMyCartButton';
import CategoriesSection from './CategoriesSection';
import Footer from 'examples/footer';
import bundleImage from 'assets/images/BUNDLES/1/R3-Racing-Wheel-and-Pedals-2.webp';
import { getProductImageUrl } from 'utils/productImage';
import {
  groupProductsByCategory,
  getCategorySectionId,
  loadAllProducts,
} from 'utils/productData.mjs';

const getProductImage = (product) => {
  return getProductImageUrl(product.img_url, bundleImage);
};

function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryClickCount, setCategoryClickCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = JSON.parse(
        sessionStorage.getItem('productCart') || '[]',
      );
      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem('productCart', JSON.stringify(cart));
  }, [cart]);

  const fetchCategoriesAndProducts = async (background = false) => {
    if (!background) {
      setLoading(true);
      setError('');
    }
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_CATEGORIES_ENDPOINT),
        loadAllProducts(async (params) => {
          const response = await axios.get(
            process.env.REACT_APP_PRODUCTS_ENDPOINT,
            { params },
          );
          return response.data;
        }),
      ]);
      const categories = categoriesResponse.data;
      const products = productsResponse;
      if (!Array.isArray(categories) || !Array.isArray(products)) {
        throw new Error('Invalid catalog response');
      }

      setCategories(categories);
      setSelectedCategoryId((selected) =>
        categories.some((category) => category.id === selected)
          ? selected
          : null,
      );

      const productsData = groupProductsByCategory(categories, products);

      setProductsByCategory(productsData);
      setCart((previous) => reconcileCartStock(previous, products));
    } catch (err) {
      console.error(err.message);
      if (!background)
        setError('Products could not be loaded. Please try again.');
    } finally {
      if (!background) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  useEffect(() => {
    if (selectedCategoryId === null || loading || error) return;
    const category = categories.find((item) => item.id === selectedCategoryId);
    if (category) {
      document.getElementById(getCategorySectionId(category))?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      });
    }
  }, [selectedCategoryId, categoryClickCount, loading, error]);

  useBackgroundRefresh(() => fetchCategoriesAndProducts(true));

  const handleAddToCart = (product) => {
    setCart((previous) =>
      setCartQuantity(previous, product, cartQuantity(previous, product) + 1),
    );
  };

  const handleUpdateQuantity = (product, quantity) => {
    setCart((previous) => setCartQuantity(previous, product, quantity));
  };

  const handleRemoveAll = (product) => {
    setCart((prevCart) =>
      prevCart.filter((item) => Number(item.id) !== Number(product.id)),
    );
  };

  if (loading) return <LoadingScreen label="Loading the shop" />;

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        ...productSurface,
        overflow: 'hidden',
      }}
    >
      <NavBar />
      <CategoriesSection
        categories={loading || error ? [] : categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          setCategoryClickCount((count) => count + 1);
        }}
      />
      {error && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => fetchCategoriesAndProducts()}>Retry</Button>
          }
        >
          {error}
        </Alert>
      )}
      {!loading && !error && categories.length === 0 && (
        <Typography sx={{ textAlign: 'center', py: 8 }}>
          No categories are available yet.
        </Typography>
      )}
      {!loading && !error && (
        <>
          {categories
            .filter((category) => category.id === selectedCategoryId)
            .map((category) => {
              const products = productsByCategory[category.id];
              return (
                <ProductList
                  key={category.id}
                  id={getCategorySectionId(category)}
                  products={
                    products
                      ? products.map((product) => ({
                          ...product,
                          img_url: getProductImage(product),
                          onAddToCart:
                            cartQuantity(cart, product) < stockLimit(product)
                              ? () => handleAddToCart(product)
                              : undefined,
                        }))
                      : []
                  }
                  onBrowseCategories={() => {
                    setSelectedCategoryId(null);
                    window.scrollTo({
                      top: 0,
                      behavior: window.matchMedia(
                        '(prefers-reduced-motion: reduce)',
                      ).matches
                        ? 'auto'
                        : 'smooth',
                    });
                  }}
                  category={category.name}
                />
              );
            })}
        </>
      )}
      <ViewMyCartButton
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveAll={handleRemoveAll}
        setCart={setCart}
        fetchCategoriesAndProducts={fetchCategoriesAndProducts}
      />
      <Footer />
    </Grid>
  );
}

export default Product;
