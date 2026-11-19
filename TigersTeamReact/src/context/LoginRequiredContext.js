import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

const LoginRequiredContext = createContext();

export const LoginRequiredProvider = ({ children }) => {
  const [loginRequired, setLoginRequired] = useState(false);

  const showLoginRequired = useCallback(() => {
    setLoginRequired(true);
  }, []);

  const hideLoginRequired = useCallback(() => {
    setLoginRequired(false);
  }, []);

  return (
    <LoginRequiredContext.Provider
      value={{ loginRequired, showLoginRequired, hideLoginRequired }}
    >
      {children}
    </LoginRequiredContext.Provider>
  );
};

LoginRequiredProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLoginRequired = () => useContext(LoginRequiredContext);
