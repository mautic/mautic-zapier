const Form = require('../entities/form');

const getForms = (z, bundle) => {
  var form = new Form(z, bundle);
  return form.getSimpleList();
};

module.exports = {
  key: 'forms',
  noun: 'Form',
  display: {
    hidden: true,
    label: 'List of forms',
    description: 'A helper trigger to get a list of forms for dynamic dropdown'
  },
  operation: {
    perform: getForms,
  }
};
