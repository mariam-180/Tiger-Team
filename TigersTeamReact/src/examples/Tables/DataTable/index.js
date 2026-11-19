import React, { useMemo, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { filterTableRows, sortTableRows } from 'utils/tableData.mjs';

import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from 'react-table';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Autocomplete from '@mui/material/Autocomplete';

import Box from 'components/ThisBox';
import Typography from 'components/ThisTypography';
import Input from 'components/ThisInput';
import Pagination from 'components/ThisPagination';

import DataTableHeadCell from 'examples/Tables/DataTable/DataTableHeadCell';
import DataTableBodyCell from 'examples/Tables/DataTable/DataTableBodyCell';

function DataTable({
  entriesPerPage = { defaultValue: 5, entries: [5, 10, 15, 20, 25] },
  canSearch = false,
  showTotalEntries = true,
  table,
  pagination = { variant: 'gradient', color: 'error' },
  isSorted = true,
  noEndBorder = false,
}) {
  const defaultValue = entriesPerPage?.defaultValue
    ? entriesPerPage?.defaultValue
    : 5;
  const entries = entriesPerPage?.entries
    ? entriesPerPage?.entries.map((el) => el.toString())
    : ['5', '10', '15', '20', '25'];
  const columns = useMemo(
    () =>
      table.columns.map((column) => ({
        ...column,
        disableSortBy:
          !isSorted ||
          column.disableSortBy ||
          ['items', 'details', 'reviewed'].includes(column.accessor),
        sortType: column.sortType || sortTableRows,
      })),
    [table.columns, isSorted],
  );
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      globalFilter: filterTableRows,
      autoResetSortBy: false,
      autoResetPage: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
  useEffect(() => {
    if (pageIndex >= Math.max(1, pageOptions.length))
      gotoPage(Math.max(0, pageOptions.length - 1));
  }, [pageIndex, pageOptions.length, gotoPage]);

  const setEntriesPerPage = (value) => setPageSize(value);

  const renderPagination = pageOptions.map((option) => (
    <Pagination
      item
      key={option}
      onClick={() => gotoPage(Number(option))}
      active={pageIndex === option}
    >
      {option + 1}
    </Pagination>
  ));

  const customizedPageOptions = pageOptions.map((option) => option + 1);
  const handleInputPaginationValue = ({ target: { value } }) => {
    const requestedPage = Number(value);
    if (
      Number.isInteger(requestedPage) &&
      requestedPage >= 1 &&
      requestedPage <= pageOptions.length
    )
      gotoPage(requestedPage - 1);
  };

  const [search, setSearch] = useState(globalFilter || '');

  useEffect(() => {
    const timer = setTimeout(() => setGlobalFilter(search || undefined), 100);
    return () => clearTimeout(timer);
  }, [search, setGlobalFilter]);

  const setSortedValue = (column) => {
    if (!isSorted || !column.canSort) return false;
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? 'desc' : 'asce';
    } else if (isSorted) {
      sortedValue = 'none';
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  const entriesStart = rows.length === 0 ? 0 : pageIndex * pageSize + 1;
  const entriesEnd = Math.min((pageIndex + 1) * pageSize, rows.length);

  return (
    <TableContainer
      sx={{ boxShadow: 'none', overflowX: 'auto', maxWidth: '100%' }}
    >
      {entriesPerPage || canSearch ? (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
          gap={2}
          flexWrap="wrap"
        >
          {entriesPerPage && (
            <Box display="flex" alignItems="center">
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                }}
                size="small"
                sx={{ width: '5rem' }}
                renderInput={(params) => <Input {...params} />}
              />
              <Typography variant="caption" color="secondary">
                &nbsp;&nbsp;entries per page
              </Typography>
            </Box>
          )}
          {canSearch && (
            <Box
              sx={{ width: { xs: '100%', sm: '12rem' }, ml: { sm: 'auto' } }}
            >
              <Input
                placeholder="Search records..."
                inputProps={{ 'aria-label': 'Search records' }}
                value={search}
                size="small"
                fullWidth
                onChange={({ currentTarget }) => {
                  setSearch(currentTarget.value);
                }}
              />
            </Box>
          )}
        </Box>
      ) : null}
      <Table className="responsive-data-table" {...getTableProps()}>
        <Box component="thead">
          {headerGroups.map((headerGroup) => {
            const { key: groupKey, ...groupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <TableRow key={groupKey} {...groupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...headerProps } =
                    column.getHeaderProps(
                      isSorted ? column.getSortByToggleProps() : undefined,
                    );
                  return (
                    <DataTableHeadCell
                      key={columnKey}
                      {...headerProps}
                      width={column.width || 'auto'}
                      align={column.align || 'left'}
                      sorted={setSortedValue(column)}
                    >
                      {column.render('Header')}
                    </DataTableHeadCell>
                  );
                })}
              </TableRow>
            );
          })}
        </Box>
        <TableBody {...getTableBodyProps()}>
          {page.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ textAlign: 'center', py: 6 }}
              >
                <Typography variant="body2">
                  {globalFilter
                    ? 'No matching records. Try a different search.'
                    : 'No records yet. New records will appear here.'}
                </Typography>
              </TableCell>
            </TableRow>
          )}

          {page.map((row, rowIndex) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <TableRow key={rowKey} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <DataTableBodyCell
                      key={cellKey}
                      {...cellProps}
                      data-label={
                        typeof cell.column.Header === 'string'
                          ? cell.column.Header
                          : ''
                      }
                      noBorder={noEndBorder && rowIndex === page.length - 1}
                      align={cell.column.align || 'left'}
                    >
                      {cell.render('Cell')}
                    </DataTableBodyCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <Box mb={{ xs: 3, sm: 0 }}>
            <Typography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {rows.length} entries
            </Typography>
          </Box>
        )}
        {pageOptions.length > 1 && (
          <Pagination
            variant={pagination.variant ? pagination.variant : 'gradient'}
            color={pagination.color ? pagination.color : 'info'}
          >
            {canPreviousPage && (
              <Pagination item onClick={() => previousPage()}>
                <span aria-hidden="true">&#8249;</span>
              </Pagination>
            )}
            {renderPagination.length > 6 ? (
              <Box width="5rem" mx={1}>
                <Input
                  inputProps={{
                    type: 'number',
                    min: 1,
                    max: customizedPageOptions.length,
                  }}
                  value={customizedPageOptions[pageIndex]}
                  onChange={handleInputPaginationValue}
                />
              </Box>
            ) : (
              renderPagination
            )}
            {canNextPage && (
              <Pagination item onClick={() => nextPage()}>
                <span aria-hidden="true">&#8250;</span>
              </Pagination>
            )}
          </Pagination>
        )}
      </Box>
    </TableContainer>
  );
}

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.arrayOf(PropTypes.number),
    }),
    PropTypes.bool,
  ]),
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
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
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
