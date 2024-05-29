import React from 'react';
import PropTypes from 'prop-types';
import KeloRoom from './al_kilo';
import SnokardoRoom from './snokardo';

const RoomSelector = ({
  branch,
  backgroundImage,
  handlePcClick,
  PCs,
  loading,
  ...props
}) => {
  const roomType = branch.name;
  if (roomType === 'Al-Kilo Circle') {
    return (
      <KeloRoom
        {...props}
        pcs={PCs}
        backgroundImage={backgroundImage}
        handlePcClick={handlePcClick}
      />
    );
  } else if (roomType === 'Snokardo') {
    return (
      <SnokardoRoom
        {...props}
        pcs={PCs}
        backgroundImage={backgroundImage}
        handlePcClick={handlePcClick}
      />
    );
  } else {
    return <div>Unknown room type</div>;
  }
};

RoomSelector.propTypes = {
  branch: PropTypes.object.isRequired,
  backgroundImage: PropTypes.string,
  handlePcClick: PropTypes.func.isRequired,
  PCs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RoomSelector;
