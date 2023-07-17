const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.lead_post_save_update', 'Trigger Zapier about contact update events');

module.exports = {
  key: 'contactUpdated',
  noun: 'Contact',
  display: {
    label: 'Updated Contact',
    description: 'Triggers when an existing contact is updated.',
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: triggerHelper.getContact,
    performList: triggerHelper.getFallbackRealContact,
    sample: require('../fixtures/samples/contactUpdated.js'),
    outputFields: [triggerHelper.getContactCustomFields],
  }
};
