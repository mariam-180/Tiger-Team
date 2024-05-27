import React, {createContext, useState, useContext} from 'react';
import PropTypes from 'prop-types';

const LoginRequiredContext = createContext();

export const LoginRequiredProvider = ({children}) => {
  const [loginRequired, setLoginRequired] = useState(false);

  const showLoginRequired = () => {
    setLoginRequired(true);
  };

  const hideLoginRequired = () => {
    setLoginRequired(false);
  };

  return (
    <LoginRequiredContext.Provider
      value={{loginRequired, showLoginRequired, hideLoginRequired}}
    >
      {children}
    </LoginRequiredContext.Provider>
  );
};

LoginRequiredProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useLoginRequired = () => useContext(LoginRequiredContext);
