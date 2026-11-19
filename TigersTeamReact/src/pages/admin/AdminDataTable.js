import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from '@mui/material';
import LoadingScreen from 'components/LoadingScreen';
import DynamicTable from 'components/ThisEnhancedTable';

export default function AdminDataTable({ loadState, onRetry, ...tableProps }) {
  if (loadState === 'error')
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        Could not load {tableProps.title.toLowerCase()}. Please try again.
      </Alert>
    );
  if (loadState === 'loading' && tableProps.rows.length === 0)
    return (
      <LoadingScreen
        fullScreen={false}
        label={`Loading ${tableProps.title.toLowerCase()}`}
      />
    );
  return <DynamicTable {...tableProps} />;
}
AdminDataTable.propTypes = {
  loadState: PropTypes.string,
  onRetry: PropTypes.func,
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
};
