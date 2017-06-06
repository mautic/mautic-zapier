# Zapier app for connecting Mautic

## Prepare your Mautic

This Zapier app use Basic Authentication to access Mautic API. You have to enable it first. Go to Mautic's global configuration / API Settings and set __API enabled?__ to __Yes__ and __Enable HTTP basic auth?__ to __Yes__.

## Development notes

If you'd like to help with development, read the [Zapier tutorial](https://github.com/zapier/zapier-platform-cli/wiki/Tutorial) and install all requirements. Then clone this repository.

### Functional tests

There are functional tests covering the basic functionality. It will communicate with live Mautic instance.

1. Create `.environment` file in the root of this file and copy there content from `.environment.dist`, fill in the auth details.
2. Run `zapier test`.
