const Abstract = require('./abstract');

Tag = function(z, bundle) {
  this.singular = 'tag';
  this.plural = 'tags';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/tags';
    this.abstract = new Abstract(z, bundle, this.route, this.singular, this.plural);
  }

  /**
   * Zapier will fail if it gets a JSON object. Must be a JSON array.
   * And we don't care about IDs since the tag label itself is the unique key.
   */
  this.cleanTags = (dirtyTags) => {
    const cleanTags = []

    if (dirtyTags) {
      for (var key in dirtyTags) {
        var tag = dirtyTags[key].tag;
        cleanTags.push({id: tag, name: tag});
      }
    }

    return cleanTags;
  }

  this.getList = (params) => this.abstract.getList(params);
};

module.exports = Tag;
