import axios from 'axios';

const CONTROLLERS_ENDPOINT = process.env.REACT_APP_CONTROLLERS_ENDPOINT;

/**
 * Fetch all controllers.
 * @param {string} accessToken - The access token for authorization.
 * @return {Promise<Array>} - A promise that resolves to an array of controllers.
 */
export const fetchControllers = async (accessToken) => {
  try {
    const response = await axios.get(CONTROLLERS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching controllers:', error);
    throw new Error('Failed to fetch controllers.');
  }
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
      default:
        break;
    }
  });
};
