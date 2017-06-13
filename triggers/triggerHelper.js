const Contact = require('../entities/contact');
const Field = require('../entities/field');

TriggerHelper = function(triggerType, hookDescription) {
  this.type = triggerType;
  this.hookDescription = hookDescription;

  this.getContactCustomFields = (z, bundle) => {
    const field = new Field(z, bundle);
    return field.getList('contact');
  };

  this.getFallbackRealContact = (z, bundle) => {
    const contact = new Contact(z, bundle);
    return contact.getList(z, bundle, {limit: 1, search: '!is:anonymous'});
  };

  this.getContact = (z, bundle) => {
    const dirtyContacts = bundle.cleanedRequest[this.type];
    const contact = new Contact();
    return contact.cleanContacts(dirtyContacts);
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