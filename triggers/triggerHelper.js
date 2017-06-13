TriggerHelper = function(triggerType, hookDescription) {
  this.type = triggerType;

  this.hookDescription = hookDescription;

  this.getContactCoreFields = () => {
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

  this.cleanContacts = (dirtyContacts) => {
    const coreFields = this.getContactCoreFields();
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
  };

  this.simplifyFieldArray = (response) => {
    const fields = this.getContactCoreFields();

    if (response.fields) {
      for (var key in response.fields) {
        var field = response.fields[key];
        fields.push({key: field.alias, label: field.label});
      }
    }

    return fields;
  };

  this.getContactCustomFields = (z, bundle) => {
    const options = {
      url: bundle.authData.baseUrl+'/api/fields/contact',
    };

    return z.request(options)
      .then((response) => {
        return this.simplifyFieldArray(JSON.parse(response.content));
      });
  };

  this.getFallbackRealContact = (z, bundle) => {

    // For the test poll, you should get some real data, to aid the setup process.
    const options = {
      url: bundle.authData.baseUrl+'/api/contacts?limit=1&search=!is:anonymous',
    };

    return z.request(options)
      .then((response) => {
        return this.cleanContacts(JSON.parse(response.content).contacts)
    });
  };

  this.getContact = (z, bundle) => {
    const dirtyContacts = bundle.cleanedRequest[this.type];

    return this.cleanContacts(dirtyContacts);
  };

  this.unsubscribeHook = (z, bundle) => {
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

  this.subscribeHook = (z, bundle) => {

    // bundle.targetUrl has the Hook URL this app should call when a recipe is created.
    const data = {
      webhookUrl: bundle.targetUrl,
      name: this.hookDescription,
      description: 'Created via Zapier',
      triggers: [this.type]
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
};

module.exports = TriggerHelper;