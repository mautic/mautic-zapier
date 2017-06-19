const ContactUpdatedTrigger = require('./triggers/contactUpdated');
const ContactCreatedTrigger = require('./triggers/contactCreated');
const PointsChangedTrigger = require('./triggers/pointsChanged');
const FormSubmittedTrigger = require('./triggers/formSubmitted');
const EmailOpenedTrigger = require('./triggers/emailOpened');
const contactCreate = require('./creates/contact');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: require('./authentication'),
  beforeRequest: [
  ],
  afterResponse: [
  ],
  resources: {
  },
  triggers: {
    [ContactUpdatedTrigger.key]: ContactUpdatedTrigger,
    [ContactCreatedTrigger.key]: ContactCreatedTrigger,
    [PointsChangedTrigger.key]: PointsChangedTrigger,
    [FormSubmittedTrigger.key]: FormSubmittedTrigger,
    [EmailOpenedTrigger.key]: EmailOpenedTrigger,
  },
  searches: {
  },
  creates: {
    [contactCreate.key]: contactCreate
  }
};

module.exports = App;
