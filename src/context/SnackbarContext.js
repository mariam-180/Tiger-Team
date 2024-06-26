import React, { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbarQueue, setSnackbarQueue] = useState([]);

  const showSnackbar = (message, severity = 'info') => {
    const newSnackbar = {
      message,
      severity,
      key: new Date().getTime(),
      open: true,
    };
    setSnackbarQueue((prevQueue) => [...prevQueue, newSnackbar]);
  };

  const handleCloseSnackbar = (key) => {
    setSnackbarQueue((prevQueue) =>
      prevQueue.map((item) =>
        item.key === key ? { ...item, open: false } : item,
      ),
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredQueue = snackbarQueue.filter((item) => item.open);
      if (filteredQueue.length > 0) {
        handleCloseSnackbar(filteredQueue[0].key);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [snackbarQueue]);

  useEffect(() => {
    const allClosed = snackbarQueue.every((item) => !item.open);
    if (allClosed && snackbarQueue.length > 0) {
      setSnackbarQueue([]);
    }
  }, [snackbarQueue]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbarQueue.map((item, index) => (
        <Snackbar
          key={item.key}
          open={item.open}
          autoHideDuration={6000}
          onClose={() => handleCloseSnackbar(item.key)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          style={{ bottom: `${index * 60}px`, transition: 'bottom 0.5s' }}
        >
          <MuiAlert
            elevation={6}
            onClose={() => handleCloseSnackbar(item.key)}
            severity={item.severity}
            variant="standard"
            sx={{ width: '100%' }}
          >
            {item.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
