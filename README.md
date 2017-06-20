# Zapier app for connecting Mautic

This Zapier app is meant to be available in the Zapier Editor. You don't need to submit this app yourself, it will be there for you to select it in the Zapier user interface.

### Available Triggers
- [x] **Contact Created** - _contains contact info and field values_
- [x] **Contact Updated** - _contains contact info and field values_
- [x] **Contact Points Changed** - _contains contact info, point value and field values_
- [x] **Email Opened** - _contains contact info and field values and info about the email_
- [x] **Page Hit** - _contains contact info and field values, info about the page hit and the page itself_
- [ ] **Form Submitted** - _contains contact info and field values, info about the form and about the submission including submitted values_

### Available Actions
- [x] **Create Contact**

## Requirements

1. Mautic version 2.9.0 or newer.
2. SSL - the basic authentication requires HTTPS to be secure.

## Prepare your Mautic

This Zapier app use Basic Authentication to access Mautic API. You have to enable it first.

1. Go to Mautic's global configuration / API Settings.
2. Set __API enabled?__ to __Yes__.
3. Set __Enable HTTP basic auth?__ to __Yes__.
4. Save the configuration.

Now you are able to create Zapier actions and triggers with your Mautic installation.

## Development notes

If you'd like to help with development, read the [Zapier tutorial](https://github.com/zapier/zapier-platform-cli/wiki/Tutorial) and install all requirements. Then clone this repository.

### Functional tests

There are functional tests covering the basic functionality. It will communicate with live Mautic instance.

1. Create `.environment` file in the root of this file and copy there content from `.environment.dist`, fill in the auth details.
2. Run `zapier test`.
