import {jwtDecode} from 'jwt-decode';

const getAccessToken = (tokenName) => {
  return localStorage.getItem(tokenName);
};

const getRole = (tokenName) => {
  return localStorage.getItem(`${tokenName}_role`);
};

const setAccessToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token);
  const decodedToken = jwtDecode(token);
  localStorage.setItem(`${tokenName}_role`, decodedToken.role);
  const expirationTime = decodedToken.exp * 1000;
  localStorage.setItem(`${tokenName}_expiresAt`, expirationTime);
};

const clearAccessToken = (tokenName) => {
  localStorage.removeItem(tokenName);
  localStorage.removeItem(`${tokenName}_role`);
  localStorage.removeItem(`${tokenName}_expiresAt`);
};

const isTokenExpired = (tokenName) => {
  const expiresAt = localStorage.getItem(`${tokenName}_expiresAt`);
  return expiresAt ? new Date().getTime() > expiresAt : true;
};

const checkTokenStatus = () => {
  const tokenName = 'accessToken';
  const accessToken = getAccessToken(tokenName);
  const role = getRole(tokenName);

  if (!accessToken || isTokenExpired(tokenName)) {
    clearAccessToken(tokenName);
    return {tokenValid: false, userRole: null};
  }

  return {tokenValid: true, userRole: role};
};

export {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  checkTokenStatus,
  isTokenExpired,
};
