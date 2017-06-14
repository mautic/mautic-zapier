const Field = require('../entities/field');
const Contact = require('../entities/contact');

const getFields = (z, bundle) => {
  const field = new Field(z, bundle);
  return field.getList('contact');
};

const createContact = (z, bundle) => {
  var contact = new Contact(z, bundle);
  return contact.create(bundle.inputData);
};

module.exports = {
  key: 'contact',
  noun: 'Contact',
  display: {
    label: 'Create Contact',
    description: 'Creates a new contact.'
  },
  operation: {
    inputFields: getFields,
    perform: createContact,
    sample: require('../fixtures/contact.js'),
    outputFields: getFields,
  }
};
