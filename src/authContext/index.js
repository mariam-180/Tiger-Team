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
} from './auth';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [accessToken, setAccessTokenState] = useState(
      getAccessToken('accessToken'),
  );
  const [userRole, setUserRole] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const validateToken = useCallback(() => {
    const {tokenValid, userRole} = checkTokenStatus();
    setTokenValid(tokenValid);
    setUserRole(userRole);
    setLoading(false);

    if (!tokenValid) {
      clearAccessToken('accessToken');
      setAccessTokenState(null);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [accessToken, validateToken]);

  const login = (token) => {
    setAccessToken('accessToken', token);
    setAccessTokenState(token);
    validateToken();
    navigate('/');
  };

  const logout = () => {
    clearAccessToken('accessToken');
    setAccessTokenState(null);
    setUserRole(null);
    setTokenValid(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{accessToken, userRole, login, logout, tokenValid, loading}}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
