import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People,
  Event,
  Report,
  Settings,
  Home,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { adminRoutes } from 'adminRoutes';

const drawerWidth = 240;

const SideNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Users':
        return <People />;
      case 'Reservations':
        return <Event />;
      case 'Events':
        return <Event />;
      case 'Reports':
        return <Report />;
      case 'Home':
        return <Home />;
      default:
        return <Settings />;
    }
  };

  const drawer = (
    <Box
      sx={{
        backgroundColor: '#1c1c1c',
        color: '#fff',
        height: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Typography variant="h6" noWrap component="div" color="#ffffff">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <List>
        {adminRoutes.map((route, index) => (
          <ListItem
            button
            component={Link}
            to={route.route}
            key={index}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 0, 0, 0.4)',
                transition: 'background-color 0.3s ease',
              },
              borderRadius: '8px',
              margin: '4px 8px',
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>
              {getIcon(route.name)}
            </ListItemIcon>
            <ListItemText primary={route.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', overflow: 'hidden' }}>
      {/* AppBar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMenuOpen}
            sx={{
              mr: 2,
              display: { md: 'none' },
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              borderRadius: '50%',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" color="#ffffff">
            Admin Dashboard
          </Typography>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{ display: { md: 'none' }, mt: '45px' }}
            PaperProps={{
              style: {
                backgroundColor: '#1c1c1c',
                color: '#fff',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
              },
            }}
          >
            {adminRoutes.map((route, index) => (
              <MenuItem
                key={index}
                onClick={handleMenuClose}
                component={Link}
                to={route.route}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    transition: 'background-color 0.3s ease',
                  },
                  borderRadius: '8px',
                  margin: '4px 8px',
                }}
              >
                {getIcon(route.name)}
                <Typography sx={{ ml: 1 }}>{route.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        open
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1c1c1c',
            color: '#fff',
            borderRight: '1px solid rgba(255, 0, 0, 0.4)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '8px',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Temporary Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1c1c1c',
            color: '#fff',
            borderRight: '1px solid #d32f2f',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
            padding: '8px',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default SideNavbar;
