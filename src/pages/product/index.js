import React, { useState } from 'react';

import { Box, Grid } from '@mui/material';
import NavBar from 'examples/navbars/DefaultNavbar';
import ProductList from 'examples/productList';
import ViewMyCartButton from 'examples/viewMyCartButton';
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
    name: 'PulseWave X100',
    category: 'Bluetooth Headset',
    price: '3,200',
    stock: 12,
    isLowestPrice: false,
    image: img1,
    link: '#product-card',
    description:
      'Experience crystal-clear sound with the PulseWave X100. With noise-cancellation technology and an ergonomic design, this Bluetooth headset ensures hours of comfortable use whether you’re on a call or listening to music.',
    onAddToCart: () => alert('PulseWave X100 added to cart!'),
  },
  {
    name: 'GadgetPro Z200',
    category: 'Smart Gadget',
    price: '1,500',
    stock: 5,
    isLowestPrice: false,
    image: img2,
    link: '#another-product',
    description:
      'The GadgetPro Z200 is your perfect companion for a smart lifestyle. This multifunctional gadget includes a fitness tracker, weather updates, and smartphone integration, all in a sleek, compact design.',
    onAddToCart: () => alert('GadgetPro Z200 added to cart!'),
  },
  {
    name: 'SoundBlaze A500',
    category: 'Bluetooth Headset',
    price: '3,500',
    stock: 9,
    isLowestPrice: false,
    image: img3,
    link: '#product-card',
    description:
      'Elevate your audio experience with SoundBlaze A500. Featuring deep bass and high-definition sound, this headset also boasts a long-lasting battery, perfect for travel and daily use.',
    onAddToCart: () => alert('SoundBlaze A500 added to cart!'),
  },
  {
    name: 'VisionTech VRX',
    category: 'Virtual Reality Headset',
    price: '6,400',
    stock: 4,
    isLowestPrice: false,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#another-product',
    description:
      'Dive into new worlds with the VisionTech VRX. This cutting-edge virtual reality headset offers stunning visuals, immersive audio, and a comfortable fit, making it ideal for gaming and virtual experiences.',
    onAddToCart: () => alert('VisionTech VRX added to cart!'),
  },
  {
    name: 'AeroFit X3',
    category: 'Bluetooth Headset',
    price: '2,800',
    stock: 15,
    isLowestPrice: true,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#product-card',
    description:
      'Lightweight and powerful, the AeroFit X3 is designed for those on the go. With a sweat-resistant build and up to 20 hours of playtime, it’s perfect for workouts and outdoor adventures.',
    onAddToCart: () => alert('AeroFit X3 added to cart!'),
  },
  {
    name: 'TechMaster S400',
    category: 'Smart Gadget',
    price: '1,800',
    stock: 8,
    isLowestPrice: false,
    image:
      'https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286',
    link: '#another-product',
    description:
      'Stay ahead with the TechMaster S400. This advanced gadget integrates seamlessly with your home and office, providing smart solutions for automation, security, and communication.',
    onAddToCart: () => alert('TechMaster S400 added to cart!'),
  },
];

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
  const [cart, setCart] = useState([]);

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
      <ProductList
        id="First_Product_List"
        products={products.map((product) => ({
          ...product,
          onAddToCart: () => handleAddToCart(product),
        }))}
        category="R5"
      />
      <ProductList
        products={products.map((product) => ({
          ...product,
          onAddToCart: () => handleAddToCart(product),
        }))}
        category="R16"
      />
      <ViewMyCartButton
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveAll={handleRemoveAll}
      />
      <Footer />
    </Grid>
  );
}

export default Product;
