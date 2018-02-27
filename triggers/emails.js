const Email = require('../entities/email');

const getEmails = (z, bundle) => {
  var email = new Email(z, bundle);
  return email.getList().then(dirtyEmails => email.convertResponseToArray(dirtyEmails));
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
