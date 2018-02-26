const Email = require('../entities/email');

const getEmails = (z, bundle) => {
  var form = new Email(z, bundle);
  return form.getList().then(dirtyEmails => form.convertResponseToArray(dirtyEmails));
};

module.exports = {
  key: 'emails',
  noun: 'Email',
  display: {
    hidden: true,
    label: 'List of emails',
    description: 'A helper trigger to get a list of emails for dynamic dropdown'
  },
  operation: {
    perform: getEmails,
    sample: require('../fixtures/requests/emails.js'),
  }
};
