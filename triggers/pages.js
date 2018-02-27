const Page = require('../entities/page');

const getPages = (z, bundle) => {
  var page = new Page(z, bundle)
  return page.getList()
};

module.exports = {
  key: 'pages',
  noun: 'Page',
  display: {
    hidden: true,
    label: 'List of pages',
    description: 'A helper trigger to get a list of pages for dynamic dropdown'
  },
  operation: {
    perform: getPages,
    sample: require('../fixtures/requests/pages.js'),
  }
};
