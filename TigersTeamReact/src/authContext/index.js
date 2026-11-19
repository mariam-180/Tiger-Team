import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadingScreen from 'components/LoadingScreen';
import { safeRedirect } from 'utils/authData.mjs';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  checkTokenStatus,
  getRole,
} from './auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(
    getAccessToken('accessToken'),
  );
  const [userRole, setUserRole] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState('/');
  const navigate = useNavigate();

  const validateToken = useCallback(async () => {
    const result = await checkTokenStatus();
    setTokenValid(result.tokenValid);
    setUserRole(result.userRole);
    if (!result.tokenValid) {
      clearAccessToken('accessToken');
      setAccessTokenState(null);
    }
    setLoading(false);
    return result.tokenValid;
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!accessToken) {
      setLoading(false);
      return undefined;
    }
    checkTokenStatus()
      .then((result) => {
        if (cancelled) return;
        setTokenValid(result.tokenValid);
        setUserRole(result.userRole);
        if (!result.tokenValid) {
          clearAccessToken('accessToken');
          setAccessTokenState(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const login = async (token, destination = redirectPath) => {
    setAccessToken('accessToken', token);
    const valid = await validateToken();
    if (!valid)
      throw new Error('Your session could not be verified. Please try again.');
    setAccessTokenState(token);
    navigate(safeRedirect(destination));
  };

  const logout = () => {
    clearAccessToken('accessToken');
    setAccessTokenState(null);
    setUserRole(null);
    setTokenValid(false);
    setRedirectPath('/');
    navigate('/', { replace: true });
  };

  const fetchUserRole = async () => {
    let isMounted = true;
    const role = await getRole('accessToken');
    if (isMounted) {
      setUserRole(role);
    }
    return () => {
      isMounted = false;
    };
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        userRole,
        login,
        logout,
        tokenValid,
        loading,
        setRedirectPath,
        fetchUserRole,
      }}
    >
      {loading ? <LoadingScreen label="Checking your session" /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
