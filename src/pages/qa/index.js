/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable new-cap */
import React from 'react';

import { Box, Grid } from '@mui/material';
import ScrollAnimation from 'utils/scrollAnimation';
import ProductList from 'examples/productList';
import NavBar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';

import Slider from 'examples/videoSlider';

import vd1 from 'assets/videos/FSR_3.mp4';
import vd2 from 'assets/videos/R5_2.mp4';
import vd3 from 'assets/videos/FSR_2.mp4';
import vd4 from 'assets/videos/R5_3.mp4';

import img1 from 'assets/images/tigers_ai/tigersTeamCar_1.webp';
import img2 from 'assets/images/tigers_ai/tigersTeamCar_2.webp';
import img3 from 'assets/images/tigers_ai/tigersTeamCar_3.webp';

const products = [
  {
    name: 'Super Rockez A400',
    category: 'Bluetooth Headset',
    price: '2,900',
    stock: 7,
    isLowestPrice: true,
    image: img1,
    link: '#product-card',
    onAddToCart: () => alert('Product added to cart!'),
  },
  {
    name: 'Another Product',
    category: 'Gadget',
    price: '1,200',
    stock: 3,
    isLowestPrice: false,
    image: img2,
    link: '#another-product',
    onAddToCart: () => alert('Another product added to cart!'),
  },
  {
    name: 'Super Rockez A400',
    category: 'Bluetooth Headset',
    price: '2,900',
    stock: 7,
    isLowestPrice: true,
    image: img3,
    link: '#product-card',
    onAddToCart: () => alert('Product added to cart!'),
  },
  {
    name: 'Another Product',
    category: 'Gadget',
    price: '1,200',
    stock: 3,
    isLowestPrice: false,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#another-product',
    onAddToCart: () => alert('Another product added to cart!'),
  },
  {
    name: 'Super Rockez A400',
    category: 'Bluetooth Headset',
    price: '2,900',
    stock: 7,
    isLowestPrice: true,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#product-card',
    onAddToCart: () => alert('Product added to cart!'),
  },
  {
    name: 'Another Product',
    category: 'Gadget',
    price: '1,200',
    stock: 3,
    isLowestPrice: false,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#another-product',
    onAddToCart: () => alert('Another product added to cart!'),
  },
  // Add more products as needed
];

const media = [
  { type: 'video', src: vd1 },
  { type: 'video', src: vd2 },
  { type: 'video', src: vd3 },
  { type: 'video', src: vd4 },
];
const textContent = {
  'FSR Formula Wheel':
    'Wheel transition in seconds. Enjoy a stable, solid connection',
  'R12 Wheel Base':
    'Our advanced system continuously monitors the temperature of the motor and electronic components in real-time',
  'RS V2': 'Forged Carbon Fiber base Plate & Magnetic Shifter Paddles',
  'R16 Wheel Base':
    'Feel everything through an optimized motor design, offering practically zero torque ripple, notching or cogging.',
};

function QA() {
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
      <Slider media={media} text={textContent} />;
      <ProductList products={products} category="R5" />
      <ProductList products={products} category="Streaing" />
      <Box height="100vh" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ScrollAnimation animation="fade-up" delay={100}>
          <Box
            marginBottom="20px"
            sx={{ width: 300, height: 300, backgroundColor: 'darkGold.main' }}
          ></Box>
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={100}>
          <Box
            marginBottom="20px"
            sx={{ width: 300, height: 300, backgroundColor: 'darkGold.main' }}
          ></Box>
        </ScrollAnimation>
        <ScrollAnimation animation="fade-up" delay={100}>
          <Box
            marginBottom="20px"
            sx={{ width: 300, height: 300, backgroundColor: 'darkGold.main' }}
          ></Box>
        </ScrollAnimation>
      </Box>
      <Box height="100vh" />
      <NavBar />
      <Footer />
    </Grid>
  );
}

export default QA;
