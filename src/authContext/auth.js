const getAccessToken = (tokenName) => {
  return localStorage.getItem(tokenName);
};

const setAccessToken = (tokenName, token) => {
  localStorage.setItem(tokenName, token);
};

const clearAccessToken = (tokenName) => {
  localStorage.removeItem(tokenName);
};

const checkTokenStatus = async (tokenName) => {
  const accessToken = getAccessToken(tokenName);
  if (!accessToken) {
    return {tokenValid: false, userRole: null};
  }

  try {
    const response = await fetch(process.env.REACT_APP_CHECK_TOKEN_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {tokenValid: true, userRole: data.user_role};
    } else {
      clearAccessToken();
      return {tokenValid: false, userRole: null};
    }
  } catch (error) {
    clearAccessToken();
    return {tokenValid: false, userRole: null};
  }
};

const fetchProtectedData = async (tokenName, endpoint) => {
  const accessToken = getAccessToken(tokenName);
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json();
      if (errorData.detail === 'Token has expired. Please log in again.') {
        clearAccessToken();
      }
      return null;
    }
  } catch (error) {
    return null;
  }
};

export {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  checkTokenStatus,
  fetchProtectedData,
};
