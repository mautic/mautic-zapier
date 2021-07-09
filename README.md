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

1. Create `.environment` file in the root of this file and copy there content from `.environment.dist`, fill in the auth details.
2. Run `zapier test`.
