import React from 'react';
import PropTypes from 'prop-types';
import RoomMap from '../RoomMap';

export const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

export default function SnokardoRoom({ pcs = [], handlePcClick }) {
  return <RoomMap pcs={pcs} onPcClick={handlePcClick} layout="snokardo" />;
}
SnokardoRoom.propTypes = {
  pcs: PropTypes.array,
  handlePcClick: PropTypes.func.isRequired,
};
