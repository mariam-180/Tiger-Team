import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, CircularProgress } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import ProductList from 'examples/productList';
import ViewMyCartButton from 'examples/viewMyCartButton';
import CategoriesSection from './CategoriesSection';
import Footer from 'examples/footer';
import bundleImage from 'assets/images/BUNDLES/1/R3-Racing-Wheel-and-Pedals-2.webp';
import { getProductImageUrl } from 'utils/productImage';

const getProductImage = (product) => {
  return getProductImageUrl(product.img_url, bundleImage);
};

function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const fetchCategoriesAndProducts = async () => {
    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        axios.get(process.env.REACT_APP_CATEGORIES_ENDPOINT),
        axios.get(process.env.REACT_APP_PRODUCTS_ENDPOINT),
      ]);
      const categories = categoriesResponse.data;
      const products = productsResponse.data;

      setCategories(categories);

      const productsData = categories.reduce((acc, category) => {
        acc[category.name] = products.filter(
          (product) => String(product.category_id) === String(category.id),
        );
        return acc;
      }, {});

      const hasProducts = Object.values(productsData).some(
        (products) => products.length > 0,
      );

      if (!hasProducts) {
        setLoading(true);
      } else {
        setLoading(false);
      }

      setProductsByCategory(productsData);
    } catch (err) {
      console.error(err.message);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.name === product.name,
      );
      if (existingProduct) {
        return prevCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (product, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.name !== product.name);
      }
      return prevCart.map((item) =>
        item.name === product.name ? { ...item, quantity: newQuantity } : item,
      );
    });
  };

  const handleRemoveAll = (product) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.name !== product.name),
    );
  };

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#000',
        backgroundimage: ({
          functions: { linearGradient, rgba },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.01),
            rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <NavBar />
      <Box height="4vh" />
      <CategoriesSection categories={categories} />
      {loading && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100vh' }}
        >
          <CircularProgress />
        </Grid>
      )}
      {!loading && (
        <>
          {categories.map((category) => {
            const products = productsByCategory[category.name];
            return (
              <ProductList
                key={category.name}
                id={`${category.name}_Product`}
                products={
                  products
                    ? products.map((product) => ({
                        ...product,
                        img_url: getProductImage(product),
                        onAddToCart: () => handleAddToCart(product),
                      }))
                    : []
                }
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
