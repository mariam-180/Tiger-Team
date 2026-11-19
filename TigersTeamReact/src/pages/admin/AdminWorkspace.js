import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useAuth } from 'authContext';
import { RacingProvider } from 'examples/design/RacingUI';
import { visibleAdminSections } from './adminSections.mjs';
import './admin.css';
import PageErrorBoundary from 'components/PageErrorBoundary';
import LoadingScreen from 'components/LoadingScreen';

const ConfirmContext = createContext(null);
export const useAdminConfirm = () => useContext(ConfirmContext);

export default function AdminWorkspace({ children }) {
  const { userRole, logout } = useAuth();
  const { pathname } = useLocation();
  const sections = visibleAdminSections(userRole);
  const current = sections.find((section) => section.route === pathname);
  const [confirmation, setConfirmation] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  const resolveRef = useRef(null);
  const finish = (result) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setConfirmation(null);
  };
  useEffect(() => () => resolveRef.current?.(false), []);
  const confirm = (message) =>
    new Promise((resolve) => {
      resolveRef.current?.(false);
      resolveRef.current = resolve;
      setConfirmation(message);
    });
  return (
    <RacingProvider>
      <ConfirmContext.Provider value={confirm}>
        <Box className="admin-workspace">
          <a className="admin-skip" href="#admin-content">
            Skip to workspace
          </a>
          <header className="admin-topbar">
            <Link className="admin-brand" to="/admin">
              <span className="admin-brand-mark">T/</span>
              <span>
                TIGERS TEAM<small>OPERATIONS WORKSPACE</small>
              </span>
            </Link>
            <div className="admin-top-actions">
              <Chip size="small" label="Administrator" />
              <button
                type="button"
                className="admin-menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="admin-navigation"
                onClick={() => setMenuOpen((value) => !value)}
              >
                Sections {menuOpen ? '-' : '+'}
              </button>
              <Button onClick={logout}>Sign out</Button>
            </div>
          </header>
          <div className="admin-frame">
            <aside
              id="admin-navigation"
              className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}
            >
              <span className="admin-nav-label">WORKSPACE</span>
              <nav aria-label="Administration">
                <NavLink end to="/admin">
                  Overview
                </NavLink>
                {sections.map((section) => (
                  <NavLink key={section.route} to={section.route}>
                    <span className="admin-nav-number">{section.icon}</span>
                    {section.shortTitle}
                  </NavLink>
                ))}
              </nav>
              <p className="admin-sidebar-note">
                Changes here affect the connected site. Review details before
                saving.
              </p>
            </aside>
            <main id="admin-content" className="admin-main" tabIndex={-1}>
              <div className="admin-section-header">
                <Typography component="p" className="admin-eyebrow">
                  Tigers Team / Administration
                </Typography>
                <Typography component="h1">
                  {current?.title || 'Your site. One workspace.'}
                </Typography>
                <Typography component="p" className="admin-intro">
                  {current?.description ||
                    'Run the day, manage your catalogue and keep your racing community moving.'}
                </Typography>
              </div>
              <PageErrorBoundary resetKey={pathname}>
                <React.Suspense
                  fallback={
                    <LoadingScreen
                      fullScreen={false}
                      label="Loading workspace"
                    />
                  }
                >
                  <div className="admin-section-content" key={pathname}>
                    {children}
                  </div>
                </React.Suspense>
              </PageErrorBoundary>
            </main>
          </div>
        </Box>
        <Dialog
          open={Boolean(confirmation)}
          onClose={() => finish(false)}
          fullWidth
          maxWidth="xs"
          aria-labelledby="admin-confirm-title"
        >
          <DialogTitle id="admin-confirm-title">Confirm deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirmation} This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => finish(false)}>
              Keep record
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => finish(true)}
            >
              Delete record
            </Button>
          </DialogActions>
        </Dialog>
      </ConfirmContext.Provider>
    </RacingProvider>
  );
}
AdminWorkspace.propTypes = { children: PropTypes.node.isRequired };
