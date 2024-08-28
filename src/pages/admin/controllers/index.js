import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import axios from 'axios';
import { useAuth } from 'authContext';
import { useSnackbar } from 'context/SnackbarContext';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DefaultNavbar from 'examples/navbars/DefaultNavbar';
import Footer from 'examples/footer';
import ParentContainer from 'components/ThisContainer/filtered';
import SimpleButton from 'components/ThisSimpleButton';
import AnimatedItem from 'utils/animatedItem';
import backgroundImage from 'assets/images/tigers_ai/tigersTeamCar_8.webp';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

function AdminControllers() {
  const { accessToken } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [controllers, setControllers] = useState([]);
  const [editControllerDialogOpen, setEditControllerDialogOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedController, setSelectedController] = useState(null);
  const [deleteControllerDialogOpen, setDeleteControllerDialogOpen] =
    useState(false);
  const [controllerToDelete, setControllerToDelete] = useState(null);

  const fetchControllers = async () => {
    try {
      const controllersResponse = await axios.get(
        process.env.REACT_APP_CONTROLLERS_ENDPOINT,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setControllers(controllersResponse.data);
    } catch (error) {
      console.error('Error fetching controllers:', error);
      showSnackbar('Error fetching controllers. Please try again.', 'error');
    }
  };

  const saveController = async (controllerData) => {
    try {
      if (
        controllerData.start_date === '' ||
        controllerData.value_type !== 'DATE'
      ) {
        delete controllerData.start_date;
      }
      if (
        controllerData.end_date === '' ||
        controllerData.value_type !== 'DATE'
      ) {
        delete controllerData.end_date;
      }
      if (isEditMode) {
        await axios.patch(
          `${process.env.REACT_APP_CONTROLLERS_ENDPOINT}${controllerData.id}`,
          controllerData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        showSnackbar('Controller updated successfully', 'success');
      } else {
        await axios.post(
          process.env.REACT_APP_CONTROLLERS_ENDPOINT,
          controllerData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        showSnackbar('Controller created successfully', 'success');
      }

      fetchControllers();
      setEditControllerDialogOpen(false);
    } catch (error) {
      console.error('Error saving controller:', error);
      showSnackbar('Error saving controller. Please try again.', 'error');
    }
  };

  const deleteController = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_CONTROLLERS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchControllers();
      showSnackbar('Controller deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting controller:', error);
      showSnackbar('Error deleting controller. Please try again.', 'error');
    }
  };

  const handleEditController = (id) => {
    const controller = controllers.find((controller) => controller.id === id);
    setSelectedController(controller);
    setIsEditMode(true);
    setEditControllerDialogOpen(true);
  };

  const handleAddController = () => {
    setSelectedController({
      name: '',
      value: '',
      value_type: 'STRING',
      start_date: null,
      end_date: null,
    });
    setIsEditMode(false);
    setEditControllerDialogOpen(true);
  };

  const handleControllerDialogClose = () => {
    setEditControllerDialogOpen(false);
  };

  const handleControllerSave = () => {
    const updatedController = { ...selectedController };

    if (updatedController.value_type === 'DATE') {
      if (updatedController.start_date) {
        updatedController.start_date = `${updatedController.start_date}T00:00:00`;
      }
      if (updatedController.end_date) {
        updatedController.end_date = `${updatedController.end_date}T00:00:00`;
      }
    }

    saveController(updatedController);
  };

  const handleDeleteController = (id) => {
    const controller = controllers.find((controller) => controller.id === id);
    setControllerToDelete(controller);
    setDeleteControllerDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteController(controllerToDelete.id);
    setDeleteControllerDialogOpen(false);
  };

  const renderControllerValueInput = () => {
    switch (selectedController?.value_type) {
      case 'BOOLEAN':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={selectedController?.value === 'true'}
                onChange={(e) =>
                  setSelectedController({
                    ...selectedController,
                    value: e.target.checked ? 'true' : 'false',
                  })
                }
              />
            }
            label="Value"
          />
        );
      case 'DATE':
        return (
          <DatePicker
            label="Value"
            value={selectedController?.value || null}
            onChange={(date) => {
              const adjustedDate = date
                ? new Date(date.getTime() + 3 * 60 * 60 * 1000)
                : null;
              setSelectedController({
                ...selectedController,
                value: adjustedDate
                  ? adjustedDate.toISOString().split('.')[0]
                  : '',
              });
            }}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        );
      case 'INTEGER':
        return (
          <TextField
            label="Value"
            type="number"
            value={selectedController?.value || ''}
            onChange={(e) =>
              setSelectedController({
                ...selectedController,
                value: e.target.value,
              })
            }
            fullWidth
          />
        );
      case 'JSON':
        return (
          <TextField
            label="Value"
            value={selectedController?.value || ''}
            onChange={(e) =>
              setSelectedController({
                ...selectedController,
                value: e.target.value,
              })
            }
            fullWidth
            multiline
            rows={4}
          />
        );
      default:
        return (
          <TextField
            label="Value"
            value={selectedController?.value || ''}
            onChange={(e) =>
              setSelectedController({
                ...selectedController,
                value: e.target.value,
              })
            }
            fullWidth
          />
        );
    }
  };

  useEffect(() => {
    fetchControllers();
  }, []);

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      sx={{
        backgroundColor: '#060708',
        backgroundImage: ({
          functions: { linearGradient, rgba },
          palette: { gradients },
        }) =>
          `${linearGradient(
            rgba(gradients.dark.main, 0.01),
            rgba(gradients.dark.state, 0.01),
          )}`,
        overflow: 'hidden',
      }}
    >
      <DefaultNavbar />
      <ParentContainer
        backgroundImage={backgroundImage}
        blur={2}
        brightness={20}
        sx={{
          padding: '',
          alignItems: '',
        }}
      >
        <DashboardLayout>
          <Box
            sx={{
              width: {
                xs: '90vw',
                sm: '92vw',
                md: '94vw',
                xl: '95.5vw',
              },
              marginBottom: '40px',
              marginTop: '90px',
            }}
          >
            <Button
              variant="contained"
              onClick={handleAddController}
              sx={{
                marginBottom: 2,
                backgroundColor: '#35465c',
                color: '#fff !IMPORTANT',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Add New Controller
            </Button>
            <Grid container spacing={2}>
              {controllers.map((controller) => (
                <Grid item xs={12} sm={6} md={4} key={controller.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: '#f5f5f5',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          marginBottom: 1,
                          fontWeight: 'bold',
                          color: '#d00',
                          textTransform: 'capitalize',
                          letterSpacing: '0.5px',
                          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        {controller.name}
                      </Typography>

                      <Typography variant="body2" sx={{ marginBottom: 2 }}>
                        Type: {controller.value_type}
                      </Typography>
                      <Box sx={{ marginBottom: 2 }}>
                        {controller.value_type === 'BOOLEAN' ? (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={controller.value === 'true'}
                                onChange={(e) =>
                                  saveController({
                                    ...controller,
                                    value: e.target.checked ? 'true' : 'false',
                                  })
                                }
                                disabled
                              />
                            }
                            label="Value"
                          />
                        ) : controller.value_type === 'DATE' ? (
                          <>
                            {controller.start_date ? (
                              <Typography variant="body2">
                                Start date:{' '}
                                {new Date(
                                  controller.start_date,
                                ).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <></>
                            )}
                            {controller.end_date ? (
                              <Typography variant="body2">
                                End date:{' '}
                                {new Date(
                                  controller.end_date,
                                ).toLocaleDateString()}
                              </Typography>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <Typography variant="body2">
                            {controller.value}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: 'space-between',
                        padding: '8px 16px',
                      }}
                    >
                      <IconButton
                        color="primary"
                        onClick={() => handleEditController(controller.id)}
                        sx={{
                          borderRadius: '50%',
                          padding: '8px',
                          backgroundColor: '#1976d2',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#115293',
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteController(controller.id)}
                        sx={{
                          borderRadius: '50%',
                          padding: '8px',
                          backgroundColor: '#d32f2f',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#9a0007',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DashboardLayout>
      </ParentContainer>
      <AnimatedItem>
        <Footer />
      </AnimatedItem>
      <Dialog
        open={editControllerDialogOpen}
        onClose={handleControllerDialogClose}
      >
        <DialogTitle>
          {isEditMode ? 'Edit Controller' : 'Add New Controller'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Controller Name"
            value={selectedController?.name || ''}
            onChange={(e) =>
              setSelectedController({
                ...selectedController,
                name: e.target.value,
              })
            }
            fullWidth
            sx={{ marginBottom: 3, marginTop: 3 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 3 }}>
            <Select
              value={selectedController?.value_type || 'STRING'}
              onChange={(e) =>
                setSelectedController({
                  ...selectedController,
                  value_type: e.target.value,
                })
              }
            >
              <MenuItem value="STRING">String</MenuItem>
              <MenuItem value="INTEGER">Integer</MenuItem>
              <MenuItem value="BOOLEAN">Boolean</MenuItem>
              <MenuItem value="DATE">Date</MenuItem>
              <MenuItem value="JSON">JSON</MenuItem>
            </Select>
          </FormControl>
          {renderControllerValueInput()}
          {selectedController?.value_type === 'DATE' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                value={selectedController?.start_date || null}
                onChange={(e) =>
                  setSelectedController({
                    ...selectedController,
                    start_date: e.target.value,
                  })
                }
                fullWidth
                sx={{ marginBottom: 3 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={selectedController?.end_date || null}
                onChange={(e) =>
                  setSelectedController({
                    ...selectedController,
                    end_date: e.target.value,
                  })
                }
                fullWidth
                sx={{ marginBottom: 3 }}
                InputLabelProps={{ shrink: true }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <SimpleButton onClick={handleControllerDialogClose}>
            Cancel
          </SimpleButton>
          <SimpleButton onClick={handleControllerSave}>Save</SimpleButton>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteControllerDialogOpen}
        onClose={() => setDeleteControllerDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        controllerName={controllerToDelete?.name}
      />
    </Grid>
  );
}

export default AdminControllers;
