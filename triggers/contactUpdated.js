const triggerHelper = require('./triggerHelper');

triggerHelper.setType('mautic.lead_post_save_update');

module.exports = {
  key: 'contactUpdated',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Contact',
  display: {
    label: 'Updated Contact',
    description: 'Trigger when an existing contact is updated.'
  },

  // `operation` is where the business logic goes.
  operation: {

    type: 'hook',

    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,

    perform: triggerHelper.getContact,
    performList: triggerHelper.getFallbackRealContact,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: require('../fixtures/contactUpdated.js'),

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: triggerHelper.getContactCustomFields
  }
};
