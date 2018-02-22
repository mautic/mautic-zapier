const Field = require('../entities/field');
const Contact = require('../entities/contact');

const modifyTagFields = (fields) => {
  // Add tag list fields
  fields = fields.concat([
    {key: 'addTags', type: 'string', label: 'Add Tags', dynamic: 'tags.id.tag', list: true, helpText: 'Select the tags you want to add to the contact'},
    {key: 'removeTags', type: 'string', label: 'Remove Tags', dynamic: 'tags.id.tag', list: true, helpText: 'Select the tags you want to remove from the contact. Wroks only for updates of existing contacts.'},
  ]);

  // remove string tag field
  for (var key in fields) {
    if (fields[key].key === 'tags') {
      delete fields[key];
    }
  }

  return fields;
};

const getFields = (z, bundle) => {
  const field = new Field(z, bundle);
  return field.getList('contact').then(fields => modifyTagFields(fields));
};

const createContact = (z, bundle) => {
  var contact = new Contact(z, bundle);
  return contact.create(bundle.inputData);
};

module.exports = {
  key: 'contact',
  noun: 'Contact',
  display: {
    label: 'Create or Update Contact',
    description: 'Creates a new contact or updates and existing contact.'
  },
  operation: {
    inputFields: [getFields],
    perform: createContact,
    sample: require('../fixtures/samples/contact.js'),
    outputFields: [getFields],
  }
};
