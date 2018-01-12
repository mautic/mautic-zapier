const throwJsonErrors = (response) => {

  if (response.json && response.json.errors) {
    throw new Error(response.json.errors[0].message);
  }

  if (response.json && response.json.error) {
    throw new Error(response.json.error.message);
  }

  return response;
};

module.exports = [
  throwJsonErrors
];
