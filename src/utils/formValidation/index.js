/* eslint-disable camelcase */
import {validateEmail} from './Email';
import {validatePhone} from './Phone';

export const validateForm = (formData) => {
  const {email, phone_number} = formData;
  let phoneNumber = phone_number;
  if (phone_number.startsWith('+962') || phone_number.startsWith('962')) {
    phoneNumber = phone_number.replace(/^(\+?962)/, '0');
  }
  return {
    email: validateEmail(email) ? email : 'Invalid',
    phone: validatePhone(phoneNumber) ? phoneNumber : 'Invalid',
  };
};
