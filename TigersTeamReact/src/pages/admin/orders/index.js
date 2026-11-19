import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import { useAdminConfirm } from '../AdminWorkspace';
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
import DynamicTable from '../AdminDataTable';
import { useSnackbar } from 'context/SnackbarContext';

function AdminOrders() {
  const confirmDelete = useAdminConfirm();
  const [saving, setSaving] = useState(false);
  const [loadState, setLoadState] = useState('loading');
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editOrderDialogOpen, setEditOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const formattedDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 3);
    return newDate.toLocaleString();
  };

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
    {
      Header: 'Action',
      accessor: 'action',
      disableSortBy: true,
      align: 'center',
    },
  ];

  const fetchData = async (background = false) => {
    background = background === true;
    if (!background) setLoadState('loading');
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

      setFilteredOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setLoadState('ready');
    } catch (error) {
      if (background) return;
      setLoadState('error');
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
    if (saving) return false;
    setSaving(true);
    try {
      await axios.patch(`${process.env.REACT_APP_ORDERS_ENDPOINT}${id}`, data, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchData();
      showSnackbar('Order updated successfully', 'success');
      return true;
    } catch (error) {
      if (error.response && error.response.status === 402) {
        showSnackbar(
          `Insufficient Credit!
            ${error.response.data.detail}`,
          'error',
        );
      } else {
        console.error('Error updating order:', error);
        showSnackbar('Error updating order. Please try again.', 'error');
      }
    } finally {
      setSaving(false);
    }
    return false;
  };

  const deleteOrder = async (id) => {
    if (!(await confirmDelete('Delete this order record?'))) return;
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
    setEditOrderDialogOpen(true);
  };

  const handleOrderDialogClose = () => setEditOrderDialogOpen(false);

  const handleOrderSave = async () => {
    if (await updateOrder(selectedOrder.id, selectedOrder))
      setEditOrderDialogOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          <>
            <DynamicTable
              loadState={loadState}
              onRetry={fetchData}
              title="Orders"
              columns={orderColumns}
              rows={filteredOrders.map((order) => ({
                id: order.id,
                __sortValues: {
                  created_at: Date.parse(order.created_at),
                  updated_at: Date.parse(order.updated_at),
                },
                customer_email: order.user?.email || 'Account unavailable',
                total_amount: order.total_amount,
                status: order.status,
                created_at: formattedDate(order.created_at),
                updated_at: formattedDate(order.updated_at),
                items: (
                  <Box>
                    <Typography variant="body2">
                      {`Total Items: ${(order.items || []).length}`}
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
                      sx={{}}
                      MenuListProps={{
                        sx: {
                          display: 'flex',
                          overflowX: 'auto',
                          flexDirection: 'column',
                        },
                      }}
                    >
                      {(order.items || []).map((item, index) => (
                        <MenuItem
                          key={index}
                          sx={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {`${item.product?.name || 'Product unavailable'} - Quantity: ${item.quantity}`}
                          &nbsp;
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                ),
                action: (
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    gap={1}
                  >
                    <Button
                      onClick={() => handleEditOrder(order.id)}
                      sx={{ color: '#f48297', opacity: '0.9' }}
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
          </>
        </Box>
      </>

      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={editOrderDialogOpen}
        onClose={handleOrderDialogClose}
      >
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <TextField
            label="Total Amount"
            InputProps={{ readOnly: true }}
            value={selectedOrder?.total_amount ?? ''}
            onChange={(e) =>
              setSelectedOrder({
                ...selectedOrder,
                total_amount: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 2, marginTop: 2 }}
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
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            Items
          </Typography>
          <List>
            {selectedOrder?.items?.length > 0 ? (
              selectedOrder.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${item.product?.name || 'Product unavailable'} - Quantity: ${item.quantity}`}
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
          <SimpleButton
            disabled={saving}
            onClick={handleOrderSave}
            color="primary"
          >
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default AdminOrders;
