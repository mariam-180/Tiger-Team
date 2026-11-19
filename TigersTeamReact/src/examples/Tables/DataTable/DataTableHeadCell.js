import React from 'react';
import PropTypes from 'prop-types';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from 'components/ThisBox';

function SortArrow(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 6l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DataTableHeadCell({
  width = 'auto',
  children,
  sorted = 'none',
  align = 'left',
  ...rest
}) {
  const { onClick, title, ...headerProps } = rest;
  const active = sorted === 'asce' || sorted === 'desc';
  return (
    <Box
      component="th"
      {...headerProps}
      width={width}
      py={2}
      px={3}
      textAlign={align}
      scope="col"
      aria-sort={
        active ? (sorted === 'desc' ? 'descending' : 'ascending') : undefined
      }
      sx={{
        borderBottom: '1px solid #373942',
        color: '#fff',
        fontSize: '.65rem',
        lineHeight: 1.6,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        whiteSpace: 'normal',
      }}
    >
      {sorted !== false ? (
        <TableSortLabel
          active={active}
          direction={sorted === 'asce' ? 'asc' : 'desc'}
          onClick={onClick}
          title={title || 'Sort this column'}
          IconComponent={SortArrow}
          sx={{
            color: '#fff',
            gap: 0.75,
            alignItems: 'center',
            '&:hover': { color: '#ff647c' },
            '&.Mui-active': { color: '#fff' },
            '& .MuiTableSortLabel-icon': {
              color: '#ff647c !important',
              opacity: active ? 1 : 0.55,
              flexShrink: 0,
              margin: 0,
            },
          }}
        >
          {children}
        </TableSortLabel>
      ) : (
        children
      )}
    </Box>
  );
}
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, 'none', 'asce', 'desc']),
  align: PropTypes.oneOf(['left', 'right', 'center']),
};
export default DataTableHeadCell;
