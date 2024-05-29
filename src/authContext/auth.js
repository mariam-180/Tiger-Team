import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const REACT_APP_CHECK_TOKEN_ENDPOINT =
  process.env.REACT_APP_CHECK_TOKEN_ENDPOINT;

const roleHierarchy = {
  3: 'SUPER_USER',
  2: 'EMPLOYEE_USER',
  1: 'END_USER',
};

const getAccessToken = (tokenName) => localStorage.getItem(tokenName);

const setAccessToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token);
  const decodedToken = jwtDecode(token);
  const expirationTime = decodedToken.exp * 1000;
  localStorage.setItem(`${tokenName}_expiresAt`, expirationTime);
};

const clearAccessToken = (tokenName) => {
  localStorage.removeItem(tokenName);
  localStorage.removeItem(`${tokenName}_expiresAt`);
};

const isTokenExpired = (tokenName) => {
  const expiresAt = localStorage.getItem(`${tokenName}_expiresAt`);
  return expiresAt ? new Date().getTime() > expiresAt : true;
};

const checkTokenStatus = async () => {
  const tokenName = 'accessToken';
  const accessToken = getAccessToken(tokenName);

  if (!accessToken || isTokenExpired(tokenName)) {
    clearAccessToken(tokenName);
    return {tokenValid: false, userRole: null};
  }

  try {
    const response = await axios.get(REACT_APP_CHECK_TOKEN_ENDPOINT, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    const data = {
      tokenValid: response.data.token_valid,
      userRole: roleHierarchy[response.data.user_role],
    };
    return data;
  } catch (error) {
    console.error('Token validation failed:', error);
    clearAccessToken(tokenName);
    return {tokenValid: false, userRole: null};
  }
};

const getRole = async (tokenName) => {
  const accessToken = getAccessToken(tokenName);
  if (!accessToken) {
    return null;
  }

  try {
    const response = await axios.get(REACT_APP_CHECK_TOKEN_ENDPOINT, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    const data = {
      tokenValid: response.data.token_valid,
      userRole: roleHierarchy[response.data.user_role],
    };
    return data.userRole;
  } catch (error) {
    console.error('Failed to fetch role:', error);
    return null;
  }
};

export {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  checkTokenStatus,
  isTokenExpired,
  getRole,
};
