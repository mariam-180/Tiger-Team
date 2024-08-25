import React, { useEffect, useState } from 'react';
import { useAuth } from 'authContext';
import axios from 'axios';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import { useSnackbar } from 'context/SnackbarContext';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

function AdminProducts() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state to check if the form is in edit mode
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const productColumns = [
    { Header: 'Product Name', accessor: 'name', align: 'left' },
    { Header: 'Price', accessor: 'price', align: 'left' },
    { Header: 'Stock Quantity', accessor: 'stock_quantity', align: 'left' },
    { Header: 'Category', accessor: 'category_name', align: 'left' },
    { Header: 'Action', accessor: 'action', align: 'center' },
  ];

  const fetchCategories = async () => {
    try {
      const categoriesResponse = await axios.get(
        process.env.REACT_APP_CATEGORIES_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showSnackbar('Error fetching categories. Please try again.', 'error');
    }
  };

  const fetchData = async () => {
    try {
      const productsResponse = await axios.get(
        process.env.REACT_APP_PRODUCTS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const fetchedProducts = productsResponse.data.map((product) => {
        const category = categories.find(
          (cat) => cat.id == product.category_id,
        );
        return {
          ...product,
          category_name: category ? category.name : 'Unknown',
        };
      });
      setFilteredProducts(fetchedProducts);
      setProducts(fetchedProducts);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProducts([]);
        setFilteredProducts([]);
        showSnackbar('No products found.', 'info');
      } else {
        showSnackbar('Error fetching products. Please try again.', 'error');
      }
    }
  };

  const saveProduct = async (productData) => {
    try {
      const formData = new FormData();

      if (productData.name) formData.append('name', productData.name);
      if (productData.description)
        formData.append('description', productData.description);
      if (productData.price !== undefined)
        formData.append('price', productData.price);
      if (productData.stock_quantity !== undefined)
        formData.append('stock_quantity', productData.stock_quantity);
      if (productData.is_lowest_price !== undefined)
        formData.append('is_lowest_price', productData.is_lowest_price);
      if (productData.category_id !== undefined)
        formData.append('category_id', productData.category_id);

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      if (isEditMode) {
        await axios.patch(
          `${process.env.REACT_APP_PRODUCTS_ENDPOINT}${productData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        showSnackbar('Product updated successfully', 'success');
      } else {
        await axios.post(process.env.REACT_APP_PRODUCTS_ENDPOINT, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        showSnackbar('Product created successfully', 'success');
      }

      fetchData();
      setEditProductDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      showSnackbar('Error saving product. Please try again.', 'error');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_PRODUCTS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('Product deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting product:', error);
      showSnackbar('Error deleting product. Please try again.', 'error');
    }
  };

  const handleEditProduct = (id) => {
    const product = products.find((product) => product.id === id);
    setSelectedProduct(product);
    setSelectedImage(null);
    setIsEditMode(true);
    setEditProductDialogOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
    });
    setSelectedImage(null);
    setIsEditMode(false);
    setEditProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setEditProductDialogOpen(false);
  };

  const handleProductSave = () => {
    saveProduct(selectedProduct);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, [categories.length]);

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
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
      <DefaultNavbar />
      <ParentContainer
        backgroundImage={backgroundImage}
        blur={2}
        brightness={20}
        sx={{
          padding: '',
          alignItems: '',
        }}
      >
        <DashboardLayout>
          <Box
            sx={{
              width: {
                xs: '90vw',
                sm: '92vw',
                md: '94vw',
                xl: '95.5vw',
              },
              marginBottom: '40px',
              marginTop: '90px',
            }}
          >
            <Button
              variant="contained"
              onClick={handleAddProduct}
              sx={{
                marginBottom: 2,
                backgroundColor: '#35465c',
                color: '#fff !IMPORTANT',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Add New Product
            </Button>
            <AnimatedItem>
              <DynamicTable
                title="Products"
                columns={productColumns}
                rows={filteredProducts.map((product) => ({
                  name: product.name,
                  price: product.price,
                  stock_quantity: product.stock_quantity,
                  category_name: product.category_name,
                  action: (
                    <Box display="flex" justifyContent="center">
                      <Button
                        onClick={() => handleEditProduct(product.id)}
                        sx={{ color: '#00008B', opacity: '0.9' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteProduct(product.id)}
                        sx={{ color: '#8B0000', opacity: '0.9' }}
                      >
                        Delete
                      </Button>
                    </Box>
                  ),
                }))}
                isSorted
                canSearch
                entriesPerPage={{
                  defaultValue: 5,
                  entries: [5, 10, 15, 20, 25],
                }}
                showTotalEntries={false}
                noEndBorder
              />
            </AnimatedItem>
          </Box>
        </DashboardLayout>
      </ParentContainer>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
      <Dialog open={editProductDialogOpen} onClose={handleProductDialogClose}>
        <DialogTitle>
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              marginBottom: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : selectedProduct?.img_url
                    ? `${selectedProduct.img_url}?t=${new Date().getTime()}`
                    : null
              }
              alt="Product"
              style={{
                maxWidth: '150px',
                maxHeight: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          </Box>
          <TextField
            label="Product Name"
            value={selectedProduct?.name || ''}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                name: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            label="Price"
            value={selectedProduct?.price || ''}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                price: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={selectedProduct?.is_lowest_price || false}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    is_lowest_price: e.target.checked,
                  })
                }
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#005f00',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#005f00',
                  },
                }}
              />
            }
            label="Lowest Price"
            sx={{
              marginBottom: 2,
              color: '#005f00',
            }}
          />
          <TextField
            label="Stock Quantity"
            value={selectedProduct?.stock_quantity || ''}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                stock_quantity: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            value={selectedProduct?.description || ''}
            onChange={(e) =>
              setSelectedProduct({
                ...selectedProduct,
                description: e.target.value,
              })
            }
            fullWidth
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(0, 0, 0, 0.5)',
              fontFamily: 'Roboto, sans-serif',
              mb: 1,
            }}
          >
            Category:
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Select
              value={selectedProduct?.category_id || ''}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category_id: e.target.value,
                })
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              backgroundColor: '#35465c',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            <CloudUpload sx={{ marginRight: '8px' }} />
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <SimpleButton onClick={handleProductDialogClose}>Cancel</SimpleButton>
          <SimpleButton onClick={handleProductSave}>Save</SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminProducts;
