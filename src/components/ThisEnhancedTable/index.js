import React from 'react';
import PropTypes from 'prop-types';
import {Card} from '@mui/material';
import Box from 'components/ThisBox';
import Typography from 'components/ThisTypography';
import DataTable from 'examples/Tables/DataTable';

const DynamicTable = ({
  title,
  columns,
  rows,
  isSorted,
  pagination,
  entriesPerPage,
  showTotalEntries,
  canSearch,
  noEndBorder,
}) => {
  return (
    <Card sx={{overflow: 'hidden'}}>
      <Box
        mx={2}
        py={2}
        mt={0.5}
        mb={-4}
        px={2}
        variant="gradient"
        bgColor="darkGray"
        borderRadius="lg"
        coloredShadow="info"
      >
        <Typography variant="h6" color="white">
          {title}
        </Typography>
      </Box>
      <Box pt={3}>
        <DataTable
          table={{columns, rows}}
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

DynamicTable.defaultProps = {
  entriesPerPage: {defaultValue: 10, entries: [5, 10, 15, 20, 25]},
  canSearch: false,
  showTotalEntries: true,
  pagination: {variant: 'gradient', color: 'info'},
  isSorted: true,
  noEndBorder: false,
};

export default DynamicTable;
