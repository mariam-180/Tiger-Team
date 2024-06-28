import { useEffect } from 'react';

const AdminPage = () => {
  useEffect(() => {
    const openNewTab = () => {
      const endpointUrl = process.env.REACT_APP_ADMIN_REPORTS_URL;
      const username = process.env.REACT_APP_ADMIN_USERNAME;
      const password = process.env.REACT_APP_ADMIN_PASSWORD;

      const headers = new Headers();
      headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));

      const newTab = window.open(endpointUrl, '_blank');
      newTab.focus();

      window.location.href = '/';
    };

    openNewTab();
  }, []);

  return null;
};

export default AdminPage;
