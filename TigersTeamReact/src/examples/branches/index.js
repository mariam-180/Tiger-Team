import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import KeloRoom from './al_kilo';
import SnokardoRoom from './snokardo';
import { hasFixedPcLayout, sortPcs } from 'utils/pcLayout.mjs';
import AdaptiveRoom from './AdaptiveRoom';
import { useAuth } from 'authContext';
import PropTypes from 'prop-types';

const RoomSelector = ({
  branch,
  backgroundImage,
  handlePcClick,
  PCs,
  loading,
  ...props
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [view, setView] = useState('grid');
  const { userRole, accessToken, tokenValid } = useAuth();
  const canMultiSelect = Boolean(
    accessToken &&
      tokenValid &&
      ['SUPER_USER', 'EMPLOYEE_USER'].includes(userRole),
  );
  useEffect(() => {
    setSelectedNumbers([]);
    setView('grid');
  }, [PCs]);
  const mappedPcs = useMemo(
    () =>
      PCs.map((pc) => ({
        ...pc,
        selected: selectedNumbers.includes(pc.pc_number),
      })),
    [PCs, selectedNumbers],
  );
  const expectedCount =
    branch.name === 'Al-Kilo Circle' ? 7 : branch.name === 'Snokardo' ? 5 : 0;
  const hasMap =
    expectedCount > 0 && hasFixedPcLayout(sortPcs(PCs), expectedCount);
  const selectPc = (number) => {
    setSelectedNumbers((selected) =>
      !canMultiSelect
        ? []
        : selected.includes(number)
          ? selected.filter((value) => value !== number)
          : [...selected, number],
    );
    handlePcClick(number);
  };
  return (
    <Box sx={{ width: '100%' }}>
      {hasMap && (
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {[
            ['grid', 'PC cards'],
            ['map', 'Room layout'],
          ].map(([value, label]) => (
            <Button
              key={value}
              aria-pressed={view === value}
              onClick={() => setView(value)}
              sx={{
                color: view === value ? '#fff' : '#aaaabb',
                border: '1px solid',
                borderColor: view === value ? '#c71929' : '#35353f',
                bgcolor:
                  view === value ? 'rgba(199,25,41,0.15)' : 'transparent',
                borderRadius: '10px',
                px: 2,
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      )}
      {view === 'map' && hasMap ? (
        <Box
          sx={{
            position: 'relative',
            py: 3,
            px: { xs: 0, md: 2 },
            minHeight: 450,
          }}
        >
          {branch.name === 'Al-Kilo Circle' ? (
            <KeloRoom pcs={mappedPcs} handlePcClick={selectPc} />
          ) : (
            <SnokardoRoom pcs={mappedPcs} handlePcClick={selectPc} />
          )}
        </Box>
      ) : (
        <AdaptiveRoom
          branchName={branch.name}
          pcs={mappedPcs}
          onPcClick={selectPc}
        />
      )}
    </Box>
  );
};

RoomSelector.propTypes = {
  branch: PropTypes.object.isRequired,
  backgroundImage: PropTypes.string,
  handlePcClick: PropTypes.func.isRequired,
  PCs: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default RoomSelector;
