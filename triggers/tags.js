const Tag = require('../entities/tag');

const getTags = (z, bundle) => {
  const tag = new Tag(z, bundle);
  return tag.getList().then(dirtyTags => tag.cleanTags(dirtyTags));
};

module.exports = {
  key: 'tags',
  noun: 'Tag',
  display: {
    hidden: true,
    label: 'List of tags',
    description: 'A helper trigger to get a list of tags for dynamic dropdown'
  },
  operation: {
    perform: getTags,
    sample: require('../fixtures/requests/tags.js'),
  }
};
