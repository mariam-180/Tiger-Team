import React from 'react';

import PropTypes from 'prop-types';

import Box from 'components/ThisBox';

function DataTableBodyCell({
  noBorder = false,
  align = 'left',
  children,
  ...rest
}) {
  return (
    <Box
      component="td"
      {...rest}
      textAlign={align}
      py={1.5}
      px={3}
      sx={({
        palette: { light },
        typography: { size },
        borders: { borderWidth },
      }) => ({
        fontSize: size.sm,
        borderBottom: noBorder
          ? 'none'
          : `${borderWidth[1]} solid ${light.main}`,
      })}
    >
      <Box
        display="inline-block"
        maxWidth="100%"
        color="text"
        sx={{ verticalAlign: 'middle', overflowWrap: 'anywhere' }}
      >
        {children}
      </Box>
    </Box>
  );
}

DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(['left', 'right', 'center']),
};

export default DataTableBodyCell;
