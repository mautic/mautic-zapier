const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.lead_points_change', 'Trigger Zapier about contact points changed events');

module.exports = {
  key: 'pointsChanged',
  noun: 'Contact',
  display: {
    label: 'Contact Points Changed',
    description: 'Triggers when contact points change.'
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: triggerHelper.getContact,
    performList: triggerHelper.getFallbackRealContact,
    sample: require('../fixtures/samples/pointsChanged.js'),
    outputFields: [triggerHelper.getContactCustomFields],
  }
};
