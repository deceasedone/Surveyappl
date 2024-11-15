/**
 * Checks if a form has any errors
 * @param {Object} errors - An object containing form errors
 * @returns {boolean} True if the form has errors, false otherwise
 */
export const isFormInvalid = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Checks if all required fields are filled
 * @param {Object} formData - An object containing form data
 * @param {Array} requiredFields - An array of required field names
 * @returns {boolean} True if all required fields are filled, false otherwise
 */
export const areRequiredFieldsFilled = (formData, requiredFields) => {
  return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
};