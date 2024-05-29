import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  checkTokenStatus,
  getRole,
} from './auth';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [accessToken, setAccessTokenState] = useState(
      getAccessToken('accessToken'),
  );
  const [userRole, setUserRole] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState('/');
  const navigate = useNavigate();

  const validateToken = useCallback(async () => {
    let isMounted = true;
    const {tokenValid, userRole} = await checkTokenStatus();
    if (isMounted) {
      setTokenValid(tokenValid);
      setUserRole(userRole);
      setLoading(false);

      if (!tokenValid) {
        clearAccessToken('accessToken');
        setAccessTokenState(null);
        navigate('/');
      }
    }
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    if (accessToken) {
      validateToken().catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [accessToken, validateToken]);

  const login = async (token) => {
    setAccessToken('accessToken', token);
    setAccessTokenState(token);
    await validateToken();
    localStorage.removeItem('reservationState');
    navigate(redirectPath);
  };

  const logout = () => {
    clearAccessToken('accessToken');
    setAccessTokenState(null);
    setUserRole(null);
    setTokenValid(false);
    navigate('/');
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
