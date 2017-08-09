const test = (z, bundle) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  // In this example, we'll hit httpbin, which validates the Authorization Header against the arguments passed in the URL path

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return z.request({
      url: bundle.authData.baseUrl+'/api/contacts?limit=1&minimal=1',
    }).then((response) => {

      if (typeof response.json === 'undefined') {
        throw new Error('The URL you provided ('+bundle.authData.baseUrl+') is not the base URL of a Mautic instance');
      }

      if (response.json && response.json.errors) {
        throw new Error(response.json.errors[0].message);
      }

      return response;
    });
};

module.exports = {
  type: 'basic',
  fields: [
    {key: 'baseUrl', type: 'string', required: true, helpText: 'The root URL of your Mautic installation starting with https://. E.g. https://my.mautic.net.'}
  ],

  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: test
};
