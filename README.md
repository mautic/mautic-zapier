# Mautic Zapier Integration

This integration integrates a Mautic instance with 1.100+ third party web services via the [Zapier](https://zapier.com) web automation service.

## Documentation

https://mautic.org/docs/en/plugins/zapier.html

## Development

This Zapier integration is developed as an open source project at https://github.com/mautic/mautic-zapier. There is no need to push this integration to Zapier. It already exists and new version deployments are handled by Mautic core team.

If you'd like to help with development, read the [Zapier tutorial](https://github.com/zapier/zapier-platform/tree/master/packages/cli#quick-setup-guide) and install all requirements. Then:

1. Create a fork of https://github.com/mautic/mautic-zapier
2. Clone the repository. `git clone git@github.com:[your_github_username]/mautic-zapier.git` (replace [your_github_username])
3. Go to the newly created directory. `cd mautic-zapier`
4. Install dependencies. `npm install`

### Functional tests

There are functional tests covering the basic functionality.

1. Create new Oauth2 API credentials in your Mautic instance.
2. Create `.environment` file in the root of this file and copy there content from `.environment.dist`.
3. Fill in the `BASE_URL` (the domain where your Mautic runs), `TEST_OAUTH2_CLIENT_ID` and `TEST_OAUTH2_CLIENT_SECRET` are the credentials you've created in step 1.
4. Get access_token of Oauth2 by running `node access-token.js`
5. It will ask you to click on a URL address. When you do a browser window will open where you'll have to authorize the Oauth2 request.
6. Once you authorize it will redirect you to a NodeJs server and it will show the access token hash.
7. Fill in the `ACCESS_TOKEN` generated above to the `environment`.
8. Run `zapier test`.