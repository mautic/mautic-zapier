const sanitizeUrl = (request, z, bundle) => {

  // remove double slashes if the user submitted the Mautic URL with trailing slash
  if (request.url) {
    request.url = request.url.replace('//api', '/api');
  }

  if (bundle.authData && bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }

  return request;
};

module.exports = [
  sanitizeUrl
];
