export const validatePhone = (phone) => {
  return String(phone).match(
      /^\(?([0]{1})\)?([7]{1})\)?([0-9]{8})\)?$/,
  );
};
