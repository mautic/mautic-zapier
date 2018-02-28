# Mautic Zapier Integration

This integration integrates any Mautic instance with 1.100+ third party web services via the [Zapier](https://zapier.com) web automation service.

## Requirements

1. Mautic version 2.9.0 or newer with SSL - the basic authentication requires HTTPS to be secure.
3. Zapier account. Free or Paid. [View Zapier pricing](https://zapier.com/pricing/).

## Installation

There is no need to install any additional plugin to your Mautic instance. Zapier works with the API and webhooks which is standard part of Mautic. This Zapier integration use Basic Authentication to access Mautic API. It is disabled by default so enable it first.

1. Open the admin menu
2. Go to Mautic's global configuration
3. Go to API Settings
4. Set __API enabled?__ to __Yes__.
5. Set __Enable HTTP basic auth?__ to __Yes__.
6. Save the configuration.

![How to enable API and basic auth](https://www.mautic.org/wp-content/uploads/2018/02/enable-api.png)

Now Zapier will be able to create actions and triggers with your Mautic installation.

## Sign up for a Zapier account

1. Go to the [Zapier website](https://zapier.com).
2. Select the Sign Up for Free button or enter info in the form.

Or log into your existing Zapier account.

## Setup and configuration

The configured Zapier integrations are called Zaps. The main types of Zaps are Triggers and Actions.

- Triggers send data about some actions that happen in Mautic in the real time to Zapier. Zapier then transforms the data and send it to the next app you configure in the Zap.
- Actions send data from some other integration in Mautic.

### Supported Triggers
- [x] **Contact Created** - _contains contact info and field values_
- [x] **Contact Updated** - _contains contact info and field values_
- [x] **Contact Points Changed** - _contains contact info, point value and field values_
- [x] **Email Opened** - _contains contact info and field values and info about the email_
- [x] **Page Hit** - _contains contact info and field values, info about the page hit and the page itself_
- [x] **Form Submitted** - _contains contact info and field values, info about the form and about the submission including submitted values_

### Supported Actions
- [x] **Create Contact**

### 1. Find Mautic integration

When you click on _Make a Zap!_ button, search for Mautic. You may see some unofficial Mautic integrations there. We recommend to use this one. It will always be called "Mautic (2.1.0)". The version number will change in time. The latest version number is available with change log at https://github.com/mautic/mautic-zapier/releases.

If you want some inspiration or speed up the process of creating a Zap use [Mautic Zap tepmlates](https://zapier.com/apps/mautic/integrations).

### 2. Choose a Trigger or Action

At this point choose what Trigger or Action you actually need. Each trigger will get you some data about the Mautic event (page hit, email viewed, form submitted) and about the contact who did the event.

![Choose action or trigger](https://www.mautic.org/wp-content/uploads/2018/02/trigger-or-action.png)

### 3. Authorize Mautic instance

Once you choose to use Mautic integration you'll need to authorize your Mautic to it. Mautic use basic auth as mentioned earlier. So all you need is a Mautic user credentials and URL of where your Mautic lives. It's recommended to create a new user for Zapier which will have some advantages:

1. Giving a third party app credentials to your Mautic is a security risk. We can trust Zapier but accidents happen. If something happen you simply delete this special Zapier user and your admin user will be safe.
2. You will see what contacts were created by Zapier simply by looking at the created by user.

![Mautic Zap auth](https://www.mautic.org/wp-content/uploads/2018/02/zapier-auth.png)

### 4. Select an item for Triggers

Triggers will ask you to choose which entity you want to record events about. This step is required for Form Submission trigger because every form has different form fields, but it's optional for others. If you skip this step for for example Page Hits trigger Zapier will process all page hit events.

![Select entity](https://www.mautic.org/wp-content/uploads/2018/02/select-entity.png)

Zapier will let you test the integration you just configured.

### 5. Map fields

Now map the Mautic fields to the fields of the other app. In the image bellow is an example of mapping Mautic fields from Mautic's New Form Entry Trigger to GMail's Send Email Action.

![Map fields](https://www.mautic.org/wp-content/uploads/2018/02/map-fields.png)

That's it! Now if some contact submits a Mautic form the contact gets email. Alright, I hear you. Mautic can do that on its own. But you get the idea.

## How does it all work

This happens hen you create a new action or trigger at Zapier.

1. Zapier creates a new webhook via Mautic API at your Mautic instance specifically for this one Zap. Mautic will then send all events related to the trigger or action type to Zapier.
2. Zapier lets you map Mautic fields to the fields of the integration you want to connect to Mautic.
3. Once you make your Zap active. Mautic will start receiving data in case of actions and sending data in case of triggers.

## Development

This Zapier integration is developed as an open source project at https://github.com/mautic/mautic-zapier. There is no need to push this integration to Zapier. It's already there and new version deployments are handled by Mautic Core Team.

If you'd like to help with development, read the [Zapier tutorial](https://github.com/zapier/zapier-platform-cli/wiki/Tutorial) and install all requirements. Then:

1. Create a fork of https://github.com/mautic/mautic-zapier
2. Clone the repository. `git clone git@github.com:[your_github_username]/mautic-zapier.git` (replace [your_github_username])
3. Go to the newly created directory. `cd mautic-zapier`
4. Install dependencies. `npm install`

### Functional tests

There are functional tests covering the basic functionality. It will communicate with live Mautic instance.

1. Create `.environment` file in the root of this file and copy there content from `.environment.dist`, fill in the auth details.
2. Run `zapier test`.
