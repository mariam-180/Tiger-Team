import React, { useState, useEffect } from 'react';
import { useAuth } from 'authContext';
import PropTypes from 'prop-types';

import { Grid, Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktopAlt } from '@fortawesome/free-solid-svg-icons';

import { keyframes } from '@emotion/react';

export const roleHierarchy = {
  SUPER_USER: '3',
  EMPLOYEE_USER: '2',
  END_USER: '1',
};

const borderLight = keyframes`
  0% {
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px 4px rgb(255, 215, 0, 1);
  }
  100% {
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.3);
  }
`;

const RoomLayout = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '700px',
  height: '100%',
  maxHeight: '450px',
  margin: 'auto',
  top: '20px',
  padding: theme.spacing(2),
  borderRadius: '20px 20px 3px 3px',
  backgroundColor: 'rgba(0, 0, 255, 0.2)',
  border: '4px solid #d3d3d3',
  borderBottom: 'none',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    height: '4px',
    backgroundColor: '#d3d3d3',
  },
  '&::before': {
    left: 0,
    width: 'calc(50% - 40px)',
  },
  '&::after': {
    right: 0,
    width: 'calc(50% - 40px)',
  },
  [theme.breakpoints.down('sm')]: {
    bottom: '-40px',
  },
}));

const Entry = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  bottom: '-50px',
  transform: 'translateX(-50%)',
  backgroundColor: '#BCCCDC',
  padding: theme.spacing(0.5, 2),
  borderRadius: '5px',
  fontSize: '12px',
}));

const CheckInDesk = styled(Box)(({ theme }) => ({
  position: 'absolute',
  alignItems: 'center',
  width: '180px',
  padding: theme.spacing(1),
  backgroundColor: '#FFF',
  borderRadius: '5px',
  border: '1px solid #BCCCDC',
  justifyContent: 'space-between',
  display: 'flex',
  bottom: 80,
  left: 0,
  transform: 'rotate(90deg)',
}));

const EquipmentBox = styled(Box)(({ theme, isavailable, isSelected, sx }) => ({
  width: '90px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  backgroundColor:
    isavailable === 'true'
      ? isSelected
        ? 'rgba(33, 150, 243, 0.7)'
        : 'rgba(0, 255, 0, 0.3)'
      : 'rgba(255, 0, 0, 0.3)',
  borderRadius: '5px',
  border: '1px solid #BCCCDC',
  cursor: isavailable === 'true' ? 'pointer' : 'not-allowed',
  color: '#FFF',
  animation: isSelected ? `${borderLight} 1.5s infinite` : 'none',
  [theme.breakpoints.down('sm')]: {
    width: sx?.width ? undefined : '70px',
    padding: theme.spacing(0.5),
    fontSize: 'clamp(5vw, 2vw, 12vw)',
  },
  ...sx,
}));

const StyledTypography = styled(Typography)(({ theme, sx }) => ({
  fontSize: 'clamp(12px, 2vw, 18px)',
  ...sx,
}));
const KeloRoom = ({ pcs, handlePcClick }) => {
  const [pcList, setPcList] = useState(pcs);
  const { userRole, accessToken, tokenValid } = useAuth();

  useEffect(() => {
    const initializedPcs = pcs.map((pc) => ({
      ...pc,
      selected: false,
    }));
    setPcList(initializedPcs);
  }, []);

  const togglePcSelection = (pcNumber) => {
    setPcList((prevPcList) =>
      prevPcList.map((pc) =>
        pc.pc_number === pcNumber ? { ...pc, selected: !pc.selected } : pc,
      ),
    );
    handlePcClick(pcNumber);
    if (
      roleHierarchy[userRole] < roleHierarchy['EMPLOYEE_USER'] ||
      !accessToken ||
      !tokenValid
    ) {
      const initializedPcs = pcs.map((pc) => ({
        ...pc,
        selected: false,
      }));
      setPcList(initializedPcs);
    }
  };

  return (
    <>
      <Box
        position="absolute"
        top="20%"
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <EquipmentBox
          isavailable="true"
          sx={{
            width: '100%',
            margin: '10px',
          }}
        >
          <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
          <StyledTypography
            sx={{
              marginLeft: '10px',
            }}
          >
            Available
          </StyledTypography>
        </EquipmentBox>
        <EquipmentBox
          isavailable="false"
          sx={{
            width: '100%',
            margin: '10px',
          }}
        >
          <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
          <StyledTypography
            sx={{
              marginLeft: '10px',
            }}
          >
            Busy
          </StyledTypography>
        </EquipmentBox>
      </Box>
      <RoomLayout>
        <Entry>ENTRY</Entry>
        <Grid container spacing={2} direction="row">
          <Grid item xs={3}>
            <EquipmentBox
              isavailable={pcList[0].is_available}
              isSelected={pcList[0].selected}
              onClick={() =>
                pcList[0].is_available === 'true' &&
                togglePcSelection(pcList[0].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 1</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={3}>
            <EquipmentBox
              isavailable={pcList[1].is_available}
              isSelected={pcList[1].selected}
              onClick={() =>
                pcList[1].is_available === 'true' &&
                togglePcSelection(pcList[1].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 2</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={3}>
            <EquipmentBox
              isavailable={pcList[2].is_available}
              isSelected={pcList[2].selected}
              onClick={() =>
                pcList[2].is_available === 'true' &&
                togglePcSelection(pcList[2].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 3</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={3}>
            <EquipmentBox
              isavailable={pcList[3].is_available}
              isSelected={pcList[3].selected}
              onClick={() =>
                pcList[3].is_available === 'true' &&
                togglePcSelection(pcList[3].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 4</StyledTypography>
            </EquipmentBox>
            <Grid
              item
              xs={3}
              sx={{
                marginTop: 4,
                marginLeft: '1vw',
                transform: 'rotate(35deg)',
              }}
            >
              <EquipmentBox
                isavailable={pcList[4].is_available}
                isSelected={pcList[4].selected}
                onClick={() =>
                  pcList[4].is_available === 'true' &&
                  togglePcSelection(pcList[4].pc_number)
                }
              >
                <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
                <StyledTypography>PC 5</StyledTypography>
              </EquipmentBox>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                marginTop: 4,
                marginLeft: '1vw',
                transform: 'rotate(35deg)',
                marginBottom: 5,
              }}
            >
              <EquipmentBox
                isavailable={pcList[5].is_available}
                isSelected={pcList[5].selected}
                onClick={() =>
                  pcList[5].is_available === 'true' &&
                  togglePcSelection(pcList[5].pc_number)
                }
              >
                <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
                <StyledTypography>PC 6</StyledTypography>
              </EquipmentBox>
            </Grid>
            <Grid
              item
              xs={3}
              sx={{
                marginTop: 4,
                marginLeft: '1vw',
                transform: 'rotate(35deg)',
                marginBottom: 5,
              }}
            >
              <EquipmentBox
                isavailable={pcList[6].is_available}
                isSelected={pcList[6].selected}
                onClick={() =>
                  pcList[6].is_available === 'true' &&
                  togglePcSelection(pcList[6].pc_number)
                }
              >
                <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
                <StyledTypography>PC 7</StyledTypography>
              </EquipmentBox>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <CheckInDesk>
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>CHECK IN DESK</StyledTypography>
            </CheckInDesk>
          </Grid>
        </Grid>
      </RoomLayout>
    </>
  );
};

KeloRoom.propTypes = {
  handlePcClick: PropTypes.func,
  pcs: PropTypes.array,
};
export default KeloRoom;
