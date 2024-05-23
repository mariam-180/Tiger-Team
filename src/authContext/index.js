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
  const navigate = useNavigate();

  const validateToken = useCallback(async () => {
    const {tokenValid, userRole} = await checkTokenStatus('accessToken');
    setTokenValid(tokenValid);
    setUserRole(userRole);

    if (!tokenValid) {
      clearAccessToken('accessToken');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      validateToken();
    }
  }, [accessToken, navigate, validateToken]);

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
      value={{accessToken, userRole, login, logout, tokenValid}}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
