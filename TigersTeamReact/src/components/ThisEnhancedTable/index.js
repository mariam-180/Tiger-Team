import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@mui/material';
import Box from 'components/ThisBox';
import Typography from 'components/ThisTypography';
import DataTable from 'examples/Tables/DataTable';

const DynamicTable = ({
  title,
  columns,
  rows,
  isSorted = true,
  pagination = { variant: 'gradient', color: 'error' },
  entriesPerPage = { defaultValue: 5, entries: [5, 10, 15, 20, 25] },
  showTotalEntries = true,
  canSearch = false,
  noEndBorder = false,
}) => {
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box
        px={3}
        py={2.5}
        sx={{
          borderBottom: '1px solid #3b2b36',
          background: 'linear-gradient(100deg, #3b1725, #20212a)',
        }}
      >
        <Typography variant="h6" color="white">
          {title}
        </Typography>
      </Box>
      <Box>
        <DataTable
          table={{ columns, rows }}
          isSorted={isSorted}
          pagination={pagination}
          entriesPerPage={entriesPerPage}
          showTotalEntries={showTotalEntries}
          canSearch={canSearch}
          noEndBorder={noEndBorder}
        />
      </Box>
    </Card>
  );
};

DynamicTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      width: PropTypes.string,
      align: PropTypes.string,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.node,
      user_name: PropTypes.node,
      credit: PropTypes.node,
      role: PropTypes.node,
      action: PropTypes.node,
    }),
  ).isRequired,
  isSorted: PropTypes.bool,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(['contained', 'gradient']),
    color: PropTypes.oneOf([
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error',
      'dark',
      'light',
    ]),
  }),
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  showTotalEntries: PropTypes.bool,
  canSearch: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DynamicTable;
