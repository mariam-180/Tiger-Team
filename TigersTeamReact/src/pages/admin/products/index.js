import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import { useAdminConfirm } from '../AdminWorkspace';
import { getProductImageUrl } from 'utils/productImage';
import { loadAllProducts, getCategorySelectValue } from 'utils/productData.mjs';
import React, { useEffect, useState } from 'react';
import { useAuth } from 'authContext';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
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
import DynamicTable from '../AdminDataTable';
import { useSnackbar } from 'context/SnackbarContext';

function AdminProducts() {
  const confirmDelete = useAdminConfirm();
  const [saving, setSaving] = useState(false);
  const [loadState, setLoadState] = useState('loading');
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview('');
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const productColumns = [
    { Header: 'Product Name', accessor: 'name', align: 'left' },
    { Header: 'Price', accessor: 'price', align: 'left' },
    { Header: 'Stock Quantity', accessor: 'stock_quantity', align: 'left' },
    { Header: 'Availability', accessor: 'availability', align: 'left' },
    {
      Header: 'Show Stock Quantity',
      accessor: 'show_stock_quantity',
      align: 'left',
    },
    { Header: 'Category', accessor: 'category_name', align: 'left' },
    {
      Header: 'Action',
      accessor: 'action',
      disableSortBy: true,
      align: 'center',
    },
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

  const fetchData = async (background = false) => {
    background = background === true;
    if (!background) setLoadState('loading');
    try {
      const productRows = await loadAllProducts(async (params) => {
        const response = await axios.get(
          process.env.REACT_APP_PRODUCTS_ENDPOINT,
          {
            params,
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 15000,
          },
        );
        return response.data;
      });
      setFilteredProducts(productRows);
      setProducts(productRows);
      setLoadState('ready');
    } catch (error) {
      if (background) return;
      setLoadState('error');
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
    if (saving) return false;
    setSaving(true);
    try {
      const formData = new FormData();

      if (productData.name) formData.append('name', productData.name);
      if (productData.description !== undefined)
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
      if (productData.availability)
        formData.append('availability', productData.availability);
      if (productData.show_stock_quantity !== undefined)
        formData.append('show_stock_quantity', productData.show_stock_quantity);

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
      showSnackbar(
        typeof error.response?.data?.detail === 'string'
          ? error.response.data.detail
          : 'Could not save the product. Check all required fields and the image.',
        'error',
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!(await confirmDelete('Delete this product record?'))) return;
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
      availability: 'IN_STOCK',
      is_lowest_price: false,
      show_stock_quantity: true,
    });
    setSelectedImage(null);
    setIsEditMode(false);
    setEditProductDialogOpen(true);
  };

  const handleProductDialogClose = () => {
    setEditProductDialogOpen(false);
  };

  const handleProductSave = () => {
    if (
      !selectedProduct?.name?.trim() ||
      !selectedProduct?.description?.trim() ||
      (!selectedImage && (!isEditMode || !selectedProduct?.img_url)) ||
      !selectedProduct?.availability ||
      selectedProduct?.price === '' ||
      selectedProduct?.stock_quantity === '' ||
      !selectedProduct?.category_id
    ) {
      showSnackbar(
        'Complete the product name, description, price, stock quantity, category, availability and image before saving.',
        'warning',
      );
      return;
    }
    if (
      !Number.isFinite(Number(selectedProduct.price)) ||
      Number(selectedProduct.price) < 0 ||
      !Number.isInteger(Number(selectedProduct.stock_quantity)) ||
      Number(selectedProduct.stock_quantity) < 0
    ) {
      showSnackbar(
        'Enter a valid non-negative price and a whole stock quantity.',
        'warning',
      );
      return;
    }
    saveProduct(selectedProduct);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        800,
        800,
        'WEBP',
        85,
        0,
        (uri) => {
          setSelectedImage(uri);
        },
        'blob',
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [accessToken]);

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  useBackgroundRefresh(() => fetchData(true), Boolean(accessToken));

  return (
    <Grid
      container
      direction="column"
      sx={{
        backgroundColor: 'transparent',
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
      <>
        <Box
          sx={{
            width: '100%',
            minWidth: 0,
            marginBottom: '40px',
            marginTop: 0,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddProduct}
            sx={{
              marginBottom: 2,
              backgroundColor: '#b7223f',
              color: '#fff !IMPORTANT',
              '&:hover': {
                backgroundColor: '#d93150',
              },
            }}
          >
            Add New Product
          </Button>
          <>
            <DynamicTable
              loadState={loadState}
              onRetry={fetchData}
              title="Products"
              columns={productColumns}
              rows={filteredProducts.map((product) => ({
                name: product.name,
                price: product.price,
                stock_quantity: product.stock_quantity,
                availability: (product.availability || 'Unknown').replaceAll(
                  '_',
                  ' ',
                ),
                show_stock_quantity: product.show_stock_quantity ? 'Yes' : 'No',
                category_name:
                  categories.find(
                    (category) =>
                      Number(category.id) === Number(product.category_id),
                  )?.name || 'Uncategorized',
                action: (
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={1}
                  >
                    <Button
                      onClick={() => handleEditProduct(product.id)}
                      sx={{ color: '#f48297', opacity: '0.9' }}
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
          </>
        </Box>
      </>

      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={editProductDialogOpen}
        onClose={handleProductDialogClose}
      >
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
              src={imagePreview || getProductImageUrl(selectedProduct?.img_url)}
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
            required
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
            required
            value={selectedProduct?.price ?? ''}
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
                checked={selectedProduct?.show_stock_quantity || false}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    show_stock_quantity: e.target.checked,
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
            label="Show Stock Quantity"
            sx={{
              marginBottom: 2,
              color: '#005f00',
            }}
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
            required
            value={selectedProduct?.stock_quantity ?? ''}
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
            required
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
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontFamily: 'Roboto, sans-serif',
                mb: 1,
              }}
            >
              Availability:
            </Typography>
            <Select
              value={selectedProduct?.availability || 'IN_STOCK'}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  availability: e.target.value,
                })
              }
            >
              <MenuItem value="IN_STOCK">In Stock</MenuItem>
              <MenuItem value="PRE_ORDER">Pre-Order</MenuItem>
            </Select>
          </FormControl>
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
              value={getCategorySelectValue(
                categories,
                selectedProduct?.category_id,
              )}
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
              backgroundColor: '#b7223f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#d93150',
              },
            }}
          >
            <CloudUpload sx={{ marginRight: '8px' }} />
            {isEditMode ? 'Replace image' : 'Upload image (required)'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <SimpleButton onClick={handleProductDialogClose}>Cancel</SimpleButton>
          <SimpleButton disabled={saving} onClick={handleProductSave}>
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminProducts;
