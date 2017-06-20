const ContactUpdatedTrigger = require('./triggers/contactUpdated');
const ContactCreatedTrigger = require('./triggers/contactCreated');
const PointsChangedTrigger = require('./triggers/pointsChanged');
const FormSubmittedTrigger = require('./triggers/formSubmitted');
const FormsTrigger = require('./triggers/forms');
const EmailOpenedTrigger = require('./triggers/emailOpened');
const PageHitTrigger = require('./triggers/pageHit');
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
    [FormsTrigger.key]: FormsTrigger,
    [EmailOpenedTrigger.key]: EmailOpenedTrigger,
    [PageHitTrigger.key]: PageHitTrigger,
  },
  searches: {
  },
  creates: {
    [contactCreate.key]: contactCreate
  }
};

module.exports = App;
