/**
 * Finds errors related to a specific input field
 * @param {Object} errors - An object containing all form errors
 * @param {string} name - The name of the input field to find errors for
 * @returns {Object} An object containing the error for the specified input
 */
export const findInputError = (errors, name) => {
  const matchingErrors = Object.entries(errors)
    .filter(([key]) => key.includes(name))
    .reduce((acc, [, value]) => ({ ...acc, error: value }), {});

  return matchingErrors;
};

/**
 * Gets the error message for a specific input field
 * @param {Object} errors - An object containing all form errors
 * @param {string} name - The name of the input field to get the error message for
 * @returns {string|null} The error message for the specified input, or null if no error
 */
export const getInputErrorMessage = (errors, name) => {
  const inputError = findInputError(errors, name);
  return inputError.error || null;
};