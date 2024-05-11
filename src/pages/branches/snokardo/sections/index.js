import React, {useState} from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';

import Typography from 'components/ThisTypography';
import ValidationBehaviorView from 'examples/datePicker';

// Images
import deviceIMG1 from 'assets/images/backGround/championship.webp';

const devices = [
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
  {
    name: 'Device1',
    image: deviceIMG1,
  },
];

function Reservation() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState({
    date: null,
    time: null,
  });

  const handleCardClick = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    console.log('Selected Date: ', selectedDateTime.date?.format('YYYY-MM-DD'));
    console.log('Selected Time: ', selectedDateTime.time?.format('HH:mm A'));
    handleClose();
  };

  const handleDateTimeChange = (date, time) => {
    setSelectedDateTime({date, time});
  };

  return (
    <>
      <Grid
        container
        spacing={10}
        justifyContent="center"
        marginTop={1}
        marginBottom={2}
      >
        {devices.map((device, index) => (
          <Grid item xs={10} sm={5} md={3} lg={4} key={index}>
            <Card
              sx={{
                'cursor': 'pointer',
                'transition': 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 3,
                },
              }}
              onClick={handleCardClick}
            >
              <CardMedia
                component="img"
                height="170"
                image={device.image}
                alt={device.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {device.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleClose}>
        <ValidationBehaviorView
          onDateTimeChange={handleDateTimeChange}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
        />
      </Dialog>
    </>
  );
}

export default Reservation;
