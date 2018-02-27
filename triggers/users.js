const User = require('../entities/user');

const getUsers = (z, bundle) => {
  var user = new User(z, bundle);
  return user.getList()
};

module.exports = {
  key: 'users',
  noun: 'User',
  display: {
    hidden: true,
    label: 'List of users',
    description: 'A helper trigger to get a list of users for dynamic dropdown'
  },
  operation: {
    perform: getUsers,
    sample: require('../fixtures/requests/users.js'),
  }
};
