const ContactUpdatedTrigger = require('./triggers/contactUpdated');
const ContactCreatedTrigger = require('./triggers/contactCreated');
const PointsChangedTrigger = require('./triggers/pointsChanged');
const FormSubmittedTrigger = require('./triggers/formSubmitted');
const EmailsTrigger = require('./triggers/emails');
const FormsTrigger = require('./triggers/forms');
const TagsTrigger = require('./triggers/tags');
const EmailOpenedTrigger = require('./triggers/emailOpened');
const PageHitTrigger = require('./triggers/pageHit');
const contactCreate = require('./creates/contact');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: require('./authentication'),
  beforeRequest: require('./middlewares/beforeRequest'),
  afterResponse: require('./middlewares/afterResponse'),
  triggers: {
    [ContactUpdatedTrigger.key]: ContactUpdatedTrigger,
    [ContactCreatedTrigger.key]: ContactCreatedTrigger,
    [PointsChangedTrigger.key]: PointsChangedTrigger,
    [FormSubmittedTrigger.key]: FormSubmittedTrigger,
    [EmailsTrigger.key]: EmailsTrigger,
    [FormsTrigger.key]: FormsTrigger,
    [TagsTrigger.key]: TagsTrigger,
    [EmailOpenedTrigger.key]: EmailOpenedTrigger,
    [PageHitTrigger.key]: PageHitTrigger,
  },
  creates: {
    [contactCreate.key]: contactCreate
  },
};

module.exports = App;
