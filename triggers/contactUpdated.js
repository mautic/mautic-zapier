const subscribeHook = (z, bundle) => {

  // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
  const data = {
    webhookUrl: bundle.targetUrl,
    name: 'Trigger Zapier about contact update events',
    description: 'Created via Zapier',
    triggers: ['mautic.lead_post_save_update']
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: bundle.authData.baseUrl+'/api/hooks/new',
    method: 'POST',
    body: JSON.stringify(data)
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.hook.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: bundle.authData.baseUrl+'/api/hooks/'+hookId+'/delete',
    method: 'DELETE',
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const getContactCoreFields = () => {
  return [
    {key: 'id', label: 'ID'},
    {key: 'dateAdded', label: 'Date Added'},
    {key: 'dateModified', label: 'Date Modified'},
    {key: 'dateIdentified', label: 'Date Identified'},
    {key: 'lastActive', label: 'Last Active Date'},
    {key: 'createdBy', label: 'Created By ID'},
    {key: 'createdByUser', label: 'Created By User'},
    {key: 'modifiedBy', label: 'Modified By ID'},
    {key: 'modifiedByUser', label: 'Modified By User'},
    {key: 'points', label: 'Points'},
    {key: 'ownedBy', label: 'OwnedBy ID'},
    {key: 'ownedByUser', label: 'OwnedBy User'},
    {key: 'ownedByUsername', label: 'OwnedBy Username'},
  ];
};

const cleanContacts = (dirtyContacts) => {
  const coreFields = getContactCoreFields();
  const contacts = [];

  for (var key in dirtyContacts) {
    var dirtyContact = dirtyContacts[key];
    const contact = {};

    // webhook payload stores the contact info to the 'contact' property. API does not.
    if (typeof dirtyContact.contact !== 'undefined') {
      dirtyContact = dirtyContact.contact;
    }

    // Fill in the core fields we want to provide
    coreFields.forEach((field) => {
      var type = typeof dirtyContact[field.key];
      if (type !== 'undefined' && (type === 'string' || type === 'number')) {
        contact[field.key] = dirtyContact[field.key];
      }
    });

    // Flatten the custom fields
    for (var groupKey in dirtyContact.fields) {
      var fieldGroup = dirtyContact.fields[groupKey];
      for (var fieldKey in fieldGroup) {
        var field = fieldGroup[fieldKey];

        // The API response has also 'all' fields which are in different format.
        if (field && typeof field.alias !== 'undefined') {
          contact[field.alias] = field.value;
        }
      }
    }

    // Flatten the owner info
    if (dirtyContact.owner && typeof dirtyContact.owner === 'object' && dirtyContact.owner.id) {
      contact.ownedBy = dirtyContact.owner.id;
      contact.ownedByUsername = dirtyContact.owner.username;
      contact.ownedByUser = dirtyContact.owner.firstName+' '+dirtyContact.owner.lastName;
    } else {
      contact.ownedBy = null;
      contact.ownedByUsername = null;
      contact.ownedByUser = null;
    }

    contacts.push(contact);
  };

  return contacts;
}

// Take the ugly webhook request and make a nice tidy contact objects from it
const getContact = (z, bundle) => {
  const dirtyContacts = bundle.cleanedRequest['mautic.lead_post_save_update'];

  return cleanContacts(dirtyContacts);
};

// This is used for testing the zap so the user doesn't have to fake the events in Mautic.
// It must return the same format as the webhook payload
const getFallbackRealContact = (z, bundle) => {

  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: bundle.authData.baseUrl+'/api/contacts?limit=1&search=!is:anonymous',
  };

  return z.request(options)
    .then((response) => (cleanContacts(JSON.parse(response.content).contacts)));
};

// Take the custom fields response and build the array of fields in format Zapier expects
const simplifyFieldArray = (response) => {
  const fields = getContactCoreFields();

  if (response.fields) {
    for (var key in response.fields) {
      var field = response.fields[key];
      fields.push({key: field.alias, label: field.label});
    }
  }

  return fields;
};

// Dynamically load the contact custom fields from the Mautic instance
const getContactCustomFields = (z, bundle) => {
  const options = {
    url: bundle.authData.baseUrl+'/api/fields/contact',
  };

  return z.request(options)
    .then((response) => simplifyFieldArray(JSON.parse(response.content)));
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
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

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getContact,
    performList: getFallbackRealContact,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: require('../fixtures/contactUpdated.js'),

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: getContactCustomFields
  }
};
