import React from 'react';
import PropTypes from 'prop-types';
import KeloRoom from './al_kilo';
import SnokardoRoom from './snokardo';

const RoomSelector = ({
  roomType,
  backgroundImage,
  handlePcClick,
  ...props
}) => {
  const keloPCs = [
    {id: 1, isavailable: 'true'},
    {id: 2, isavailable: 'false'},
    {id: 3, isavailable: 'true'},
    {id: 4, isavailable: 'true'},
    {id: 5, isavailable: 'false'},
    {id: 6, isavailable: 'true'},
    {id: 7, isavailable: 'true'},
  ];
  const SnokardoPCs = [
    {id: 1, isavailable: 'true'},
    {id: 2, isavailable: 'false'},
    {id: 3, isavailable: 'true'},
    {id: 4, isavailable: 'true'},
  ];

  if (roomType === 'Al-Kilo Circle') {
    return (
      <KeloRoom
        {...props}
        pcs={keloPCs}
        backgroundImage={backgroundImage}
        handlePcClick={handlePcClick}
      />
    );
  } else if (roomType === 'Snokardo') {
    return (
      <SnokardoRoom
        {...props}
        pcs={SnokardoPCs}
        backgroundImage={backgroundImage}
        handlePcClick={handlePcClick}
      />
    );
  } else {
    return <div>Unknown room type</div>;
  }
};

RoomSelector.propTypes = {
  roomType: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string,
  handlePcClick: PropTypes.func,
  pcs: PropTypes.array,
};

export default RoomSelector;
