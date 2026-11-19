import axios from 'axios';

const CONTROLLERS_ENDPOINT = process.env.REACT_APP_CONTROLLERS_ENDPOINT;
let controllersRequest;

/**
 * Fetch all controllers.
 * @param {string} accessToken - The access token for authorization.
 * @return {Promise<Array>} - A promise that resolves to an array of controllers.
 */
export const fetchControllers = async () => {
  if (controllersRequest) return controllersRequest;

  controllersRequest = axios
    .get(CONTROLLERS_ENDPOINT)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching controllers:', error);
      throw new Error('Failed to fetch controllers.');
    })
    .finally(() => {
      // Deduplicate simultaneous callers, but never cache admin settings forever.
      controllersRequest = null;
    });

  return controllersRequest;
};

/**
 * Get the value of a specific controller by name.
 * @param {Array} controllers - The list of all controllers.
 * @param {string} name - The name of the controller to find.
 * @return {Object|null} - The controller object if found, otherwise null.
 */
export const getControllerByName = (controllers, name) => {
  return controllers.find((controller) => controller.name === name) || null;
};

/**
 * Perform actions based on controller values.
 * @param {Array} controllers - The list of all controllers.
 * @param {function} actionCallback - The callback function to execute when a condition is met.
 */
export const performActionsBasedOnControllers = (
  controllers,
  actionCallback,
) => {
  controllers.forEach((controller) => {
    switch (controller.name) {
      case 'ShowPrices':
        if (controller.value === 'true') {
          actionCallback('ShowPrices', true);
        } else {
          actionCallback('ShowPrices', false);
        }
        break;
      case 'EventComingSoon':
        if (controller.value === 'true') {
          actionCallback('EventComingSoon', true);
        } else {
          actionCallback('EventComingSoon', false);
        }
        break;
      case 'EventStartDate':
        if (controller.start_date) {
          const adjustedStartDate = new Date(
            new Date(controller.start_date).getTime() + 3 * 60 * 60 * 1000,
          );
          actionCallback(
            'EventStartDate',
            adjustedStartDate.toISOString().split('.')[0],
          );
        }
        break;
      case 'RegistrationOpen':
        if (controller.value === 'true') {
          actionCallback('RegistrationOpen', true);
        } else {
          actionCallback('RegistrationOpen', false);
        }
        break;
      case 'LivePageEnabled':
        if (controller.value === 'true') {
          actionCallback('LivePageEnabled', true);
        } else {
          actionCallback('LivePageEnabled', false);
        }
        break;
      default:
        break;
    }
  });
};
