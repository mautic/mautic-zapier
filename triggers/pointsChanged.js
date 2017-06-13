const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.lead_points_change', 'Trigger Zapier about contact points changed events');

// triggerHelper.setType('mautic.lead_post_save_new');
// triggerHelper.setHookDescription('Trigger Zapier about contact create events');

module.exports = {
  key: 'pointsChanged',
  noun: 'Contact',
  display: {
    label: 'Contact changes points',
    description: 'Trigger on a contact points change.'
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: triggerHelper.getContact,
    performList: triggerHelper.getFallbackRealContact,
    sample: require('../fixtures/pointsChanged.js'),
    outputFields: triggerHelper.getContactCustomFields
  }
};
