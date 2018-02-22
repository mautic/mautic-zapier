const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.lead_post_save_new', 'Trigger Zapier about contact create events');

module.exports = {
  key: 'contactCreated',
  noun: 'Contact',
  display: {
    label: 'New Contact',
    description: 'Triggers when a new contact is created.',
    important: true
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: triggerHelper.getContact,
    performList: triggerHelper.getFallbackRealContact,
    sample: require('../fixtures/samples/contactCreated.js'),
    outputFields: [triggerHelper.getContactCustomFields],
  }
};
