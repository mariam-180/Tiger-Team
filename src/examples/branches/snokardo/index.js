import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktopAlt } from '@fortawesome/free-solid-svg-icons';

const RoomLayout = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '650px',
  height: '100%',
  minHeight: '300px',
  margin: 'auto',
  padding: theme.spacing(2),
  borderRadius: '20px 3px 3px 20px',
  backgroundColor: 'rgba(0, 0, 255, 0.2)',
  border: '4px solid #d3d3d3',
  borderRight: 'none',
  transform: 'rotate(90deg)',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    height: '4px',
    backgroundColor: '#d3d3d3',
  },
  '&::before': {
    top: 0,
    right: '-12%',
    width: 'calc(30% - 50px)',
    transform: 'rotate(90deg) translateX(50%)',
  },
  [theme.breakpoints.down('sm')]: {
    '&::before': {
      right: '-15%',
      width: 'calc(40% - 50px)',
    },
  },
}));

const Entry = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '-10%',
  bottom: '50px',
  transform: 'rotate(-90deg)',
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
  left: -40,
  transform: 'rotate(-90deg)',
}));

const EquipmentBox = styled(Box)(({ theme, isavailable, sx }) => ({
  width: '90px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  backgroundColor:
    isavailable === 'true' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)',
  borderRadius: '5px',
  border: '1px solid #BCCCDC',
  cursor: isavailable === 'true' ? 'pointer' : 'not-allowed',
  color: '#FFF',
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

const SnokardoRoom = ({ pcs, handlePcClick }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        position="absolute"
        sx={{
          flexDirection: { xs: 'row', md: 'column' },
          justifyContent: { xs: 'space-between', md: 'center' },
          marginBottom: { xs: theme.spacing(5), md: '0' },
          left: { xs: '23%', md: '10%', lg: '20%' },
          top: {
            xs: '15%',
            md: '20%',
            lg: '50%',
          },
        }}
        display="flex"
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
        <Grid
          sx={{
            marginLeft: {
              xs: '-5%',
              lg: '1%',
              md: '1%',
            },
          }}
          container
          spacing={2}
          direction="row"
        >
          <Grid item xs={2.4}>
            <EquipmentBox
              isavailable={pcs[0].is_available}
              onClick={() =>
                pcs[0].is_available === 'true' &&
                handlePcClick(pcs[0].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 1</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={2.4}>
            <EquipmentBox
              isavailable={pcs[1].is_available}
              onClick={() =>
                pcs[1].is_available === 'true' &&
                handlePcClick(pcs[1].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 2</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={2.4}>
            <EquipmentBox
              isavailable={pcs[2].is_available}
              onClick={() =>
                pcs[2].is_available === 'true' &&
                handlePcClick(pcs[2].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 3</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={2.4}>
            <EquipmentBox
              isavailable={pcs[3].is_available}
              onClick={() =>
                pcs[3].is_available === 'true' &&
                handlePcClick(pcs[3].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 4</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={2.4}>
            <EquipmentBox
              isavailable={pcs[4].is_available}
              onClick={() =>
                pcs[4].is_available === 'true' &&
                handlePcClick(pcs[4].pc_number)
              }
            >
              <FontAwesomeIcon icon={faDesktopAlt} size="1x" />
              <StyledTypography>PC 5</StyledTypography>
            </EquipmentBox>
          </Grid>
          <Grid item xs={12}>
            <CheckInDesk>
              <FontAwesomeIcon icon={faDesktopAlt} size="xs" />
              <StyledTypography
                sx={{
                  fontSize: 'clamp(8px, 1vw, 12px)',
                }}
              >
                CHECK IN DESK
              </StyledTypography>
            </CheckInDesk>
          </Grid>
        </Grid>
      </RoomLayout>
    </>
  );
};

SnokardoRoom.propTypes = {
  handlePcClick: PropTypes.func,
  pcs: PropTypes.array,
};

export default SnokardoRoom;
