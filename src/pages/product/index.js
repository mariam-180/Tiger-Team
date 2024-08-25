import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, CircularProgress } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import ProductList from 'examples/productList';
import ViewMyCartButton from 'examples/viewMyCartButton';
import CategoriesSection from './CategoriesSection';
import Footer from 'examples/footer';
import Slider from 'examples/videoSlider';

import vd1 from 'assets/videos/FSR_3.mp4';
import vd2 from 'assets/videos/R5_2.mp4';
import vd3 from 'assets/videos/FSR_2.mp4';
import vd4 from 'assets/videos/R5_3.mp4';

const media = [
  { type: 'video', src: vd2 },
  { type: 'video', src: vd1 },
  { type: 'video', src: vd3 },
  { type: 'video', src: vd4 },
];

const textContent = {
  'R12 Wheel Base':
    'Our advanced system continuously monitors the temperature of the motor and electronic components in real-time',
  'FSR Formula Wheel':
    'Wheel transition in seconds. Enjoy a stable, solid connection',
  'RS V2': 'Forged Carbon Fiber base Plate & Magnetic Shifter Paddles',
  'R16 Wheel Base':
    'Feel everything through an optimized motor design, offering practically zero torque ripple, notching or cogging.',
};

function Product() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const fetchCategoriesAndProducts = async () => {
    try {
      const categoriesResponse = await axios.get(
        process.env.REACT_APP_CATEGORIES_ENDPOINT,
      );
      const categories = categoriesResponse.data;

      setCategories(categories);

      const productsPromises = categories.map((category) =>
        axios.get(
          `${process.env.REACT_APP_PRODUCTS_ENDPOINT}category/${category.name}`,
        ),
      );

      const productsResponses = await Promise.all(productsPromises);

      const productsData = productsResponses.reduce((acc, response, index) => {
        acc[categories[index].name] = response.data;
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
      <Slider media={media} text={textContent} />
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
