const sanitizeUrl = (request, z) => {

  // remove double slashes if the user submitted the Mautic URL with trailing slash
  if (request.url) {
    request.url = request.url.replace('//api', '/api');
  }

  return request;
};

module.exports = [
  sanitizeUrl
];
