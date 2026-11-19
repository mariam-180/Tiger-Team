import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import NotificationToast from 'components/NotificationToast';

const SnackbarContext = createContext();
export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [open, setOpen] = useState(false);
  const nextKey = useRef(0);
  const active = queue[0];
  const showSnackbar = useCallback((message, severity = 'info') => {
    if (message == null || message === '') return;
    const item = {
      message,
      severity: ['info', 'success', 'warning', 'error'].includes(severity)
        ? severity
        : 'info',
      key: ++nextKey.current,
    };
    setQueue((previous) =>
      previous.length >= 5 ||
      previous.some(
        (entry) =>
          entry.message === message && entry.severity === item.severity,
      )
        ? previous
        : [...previous, item],
    );
  }, []);
  useEffect(() => {
    if (active) setOpen(true);
  }, [active?.key]);
  const close = (_event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };
  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {active && (
        <Snackbar
          key={active.key}
          open={open}
          autoHideDuration={6000}
          onClose={close}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          TransitionProps={{
            onExited: () =>
              setQueue((previous) =>
                previous[0]?.key === active.key ? previous.slice(1) : previous,
              ),
          }}
          sx={{
            left: { xs: 12, sm: 24 },
            right: { xs: 12, sm: 'auto' },
            bottom: { xs: 12, sm: 24 },
            width: { xs: 'auto', sm: 400 },
            maxWidth: 'calc(100vw - 24px)',
            '@media (prefers-reduced-motion: reduce)': {
              '& *': { transition: 'none !important' },
            },
          }}
        >
          <NotificationToast
            message={active.message}
            severity={active.severity}
            onClose={close}
          />
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};
SnackbarProvider.propTypes = { children: PropTypes.node.isRequired };
export const useSnackbar = () => useContext(SnackbarContext);
