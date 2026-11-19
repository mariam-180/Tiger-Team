import LoadingScreen from 'components/LoadingScreen';
import useBackgroundRefresh from 'utils/useBackgroundRefresh';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import axios from 'axios';
import { useAuth } from 'authContext';
import { useSnackbar } from 'context/SnackbarContext';
import SimpleButton from 'components/ThisSimpleButton';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

function AdminControllers() {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadState, setLoadState] = useState('loading');
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

  const fetchControllers = async (background = false) => {
    background = background === true;
    if (!background) setLoadState('loading');
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
      setLoadState('ready');
    } catch (error) {
      if (background) return;
      setLoadState('error');
      console.error('Error fetching controllers:', error);
      showSnackbar('Error fetching controllers. Please try again.', 'error');
    }
  };

  const saveController = async (controllerData) => {
    if (saving) return false;
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const deleteController = async (id) => {
    if (deleting) return false;
    setDeleting(true);
    try {
      await axios.delete(`${process.env.REACT_APP_CONTROLLERS_ENDPOINT}${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchControllers();
      showSnackbar('Setting deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting controller:', error);
      showSnackbar('Error deleting controller. Please try again.', 'error');
    } finally {
      setDeleting(false);
    }
    return false;
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
        updatedController.start_date = `${updatedController.start_date.slice(0, 10)}T00:00:00`;
      }
      if (updatedController.end_date) {
        updatedController.end_date = `${updatedController.end_date.slice(0, 10)}T00:00:00`;
      }
    }

    saveController(updatedController);
  };

  const handleDeleteController = (id) => {
    const controller = controllers.find((controller) => controller.id === id);
    setControllerToDelete(controller);
    setDeleteControllerDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!controllerToDelete) return;
    if (await deleteController(controllerToDelete.id)) {
      setDeleteControllerDialogOpen(false);
      setControllerToDelete(null);
    }
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
          <TextField
            label="Date and time (your local timezone)"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={(() => {
              const date = new Date(selectedController?.value || '');
              return Number.isNaN(date.getTime())
                ? ''
                : new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16);
            })()}
            onChange={(event) =>
              setSelectedController({
                ...selectedController,
                value: event.target.value
                  ? new Date(event.target.value).toISOString()
                  : '',
              })
            }
            fullWidth
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

  useBackgroundRefresh(() => fetchControllers(true), Boolean(accessToken));

  return (
    <Grid
      container
      direction="column"
      sx={{
        backgroundColor: 'transparent',
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
      <>
        <Box
          sx={{
            width: '100%',
            minWidth: 0,
            marginBottom: '40px',
            marginTop: 0,
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddController}
            sx={{
              marginBottom: 2,
              backgroundColor: '#b7223f',
              color: '#fff !IMPORTANT',
              '&:hover': {
                backgroundColor: '#d93150',
              },
            }}
          >
            Add site setting
          </Button>
          {loadState === 'error' && (
            <Alert
              severity="error"
              action={
                <Button color="inherit" onClick={fetchControllers}>
                  Retry
                </Button>
              }
            >
              Site settings could not be loaded.
            </Alert>
          )}
          {loadState === 'loading' && (
            <LoadingScreen fullScreen={false} label="Loading site settings" />
          )}
          {loadState === 'ready' && controllers.length === 0 && (
            <Alert severity="info">
              No site settings have been configured yet.
            </Alert>
          )}
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
                      aria-label={`Edit ${controller.name}`}
                      color="primary"
                      onClick={() => handleEditController(controller.id)}
                      sx={{
                        borderRadius: '50%',
                        padding: '8px',
                        backgroundColor: '#b7223f',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#d93150',
                        },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label={`Delete ${controller.name}`}
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
      </>

      <Dialog
        className="admin-dialog"
        fullWidth
        maxWidth="sm"
        open={editControllerDialogOpen}
        onClose={handleControllerDialogClose}
      >
        <DialogTitle>
          {isEditMode ? 'Edit Controller' : 'Add site setting'}
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
                value={selectedController?.start_date?.slice(0, 10) || ''}
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
                value={selectedController?.end_date?.slice(0, 10) || ''}
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
          <SimpleButton disabled={saving} onClick={handleControllerSave}>
            Save
          </SimpleButton>
        </DialogActions>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteControllerDialogOpen}
        onClose={() => setDeleteControllerDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        controllerName={controllerToDelete?.name || ''}
        pending={deleting}
      />
    </Grid>
  );
}

export default AdminControllers;
