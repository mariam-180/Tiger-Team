/* eslint-disable react/prop-types */

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
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import SimpleButton from 'components/ThisSimpleButton';
import DynamicTable from 'components/ThisEnhancedTable';
import ParentContainer from 'components/ThisContainer/filtered';
import { useSnackbar } from 'context/SnackbarContext';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Footer from 'examples/footer';
import AnimatedItem from 'utils/animatedItem';

import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';

function AdminOrders() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editOrderDialogOpen, setEditOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const orderColumns = [
    { Header: 'Order ID', accessor: 'id', align: 'left' },
    { Header: 'Customer Email', accessor: 'customer_email', align: 'left' },
    { Header: 'Total Amount', accessor: 'total_amount', align: 'left' },
    { Header: 'Status', accessor: 'status', align: 'left' },
    { Header: 'Created At', accessor: 'created_at', align: 'left' },
    { Header: 'Updated At', accessor: 'updated_at', align: 'left' },
    { Header: 'Items', accessor: 'items', align: 'left' },
    { Header: 'Action', accessor: 'action', align: 'center' },
  ];

  const fetchData = async () => {
    try {
      const ordersResponse = await axios.get(
        process.env.REACT_APP_ORDERS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const fetchedOrders = ordersResponse.data;
      console.log(fetchedOrders);

      setFilteredOrders(fetchedOrders);
      setOrders(fetchedOrders);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setFilteredOrders([]);
        showSnackbar('No orders found.', 'info');
      } else {
        showSnackbar('Error fetching orders. Please try again.', 'error');
      }
    }
  };

  const updateOrder = async (id, data) => {
    try {
      await axios.patch(`${process.env.REACT_APP_ORDERS_ENDPOINT}${id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('Order updated successfully', 'success');
    } catch (error) {
      console.error('Error updating order:', error);
      showSnackbar('Error updating order. Please try again.', 'error');
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_ORDERS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('Order deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting order:', error);
      showSnackbar('Error deleting order. Please try again.', 'error');
    }
  };

  const handleEditOrder = (id) => {
    const order = orders.find((order) => order.id === id);
    setSelectedOrder(order);
    console.log(order);
    setEditOrderDialogOpen(true);
  };

  const handleOrderDialogClose = () => setEditOrderDialogOpen(false);

  const handleOrderSave = () => {
    updateOrder(selectedOrder.id, selectedOrder);
    setEditOrderDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <AnimatedItem>
              <DynamicTable
                title="Orders"
                columns={orderColumns}
                rows={filteredOrders.map((order) => ({
                  id: order.id,
                  customer_email: order.user.email,
                  total_amount: order.total_amount,
                  status: order.status,
                  created_at: new Date(order.created_at).toLocaleString(),
                  updated_at: new Date(order.updated_at).toLocaleString(),
                  items: (
                    <Box>
                      <Typography variant="body2">
                        {`Total Items: ${order.items.length}`}
                      </Typography>
                      <Button
                        onClick={(event) => handleMenuOpen(event, order.id)}
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.875rem',
                          color: '#ff7009 !IMPORTANT',
                        }}
                      >
                        Show
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedOrderId === order.id}
                        onClose={handleMenuClose}
                      >
                        {order.items.map((item, index) => (
                          <MenuItem key={index}>
                            {`${item.product.name} - Quantity: ${item.quantity}`}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ),

                  action: (
                    <Box display="flex" justifyContent="center">
                      <Button
                        onClick={() => handleEditOrder(order.id)}
                        sx={{ color: '#00008B', opacity: '0.9' }}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteOrder(order.id)}
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
      <Dialog open={editOrderDialogOpen} onClose={handleOrderDialogClose}>
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Email"
            value={selectedOrder?.user?.customer_email || ''}
            onChange={(e) =>
              setSelectedOrder({
                ...selectedOrder,
                customer_email: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
          <TextField
            label="Total Amount"
            value={selectedOrder?.total_amount || ''}
            onChange={(e) =>
              setSelectedOrder({
                ...selectedOrder,
                total_amount: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Select
            label="Order Status"
            value={selectedOrder?.status || ''}
            onChange={(e) =>
              setSelectedOrder({
                ...selectedOrder,
                status: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Shipped">Shipped</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Items
          </Typography>
          <List>
            {selectedOrder?.items?.length > 0 ? (
              selectedOrder.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.product.name} - Quantity: ${item.quantity}`}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2">No items available.</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <SimpleButton onClick={handleOrderDialogClose} color="primary">
            Cancel
          </SimpleButton>
          <SimpleButton onClick={handleOrderSave} color="primary">
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminOrders;
