const Abstract = require('./abstract');

module.exports = function(z, bundle) {
  this.singular = 'page';
  this.plural = 'pages';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/pages';
    this.abstract = new Abstract(z, bundle, this.route, this.singular, this.plural);
  }

  /**
   * Zapier will fail if it gets a JSON object. Must be a JSON array.
   * And we don't care about IDs since the tag label itself is the unique key.
   */
  this.convertResponseToArray = (dirtyPages) => { // Todo move this into Astract as it's used in Email too
    const cleanPages = []

    if (dirtyPages) {
      for (var key in dirtyPages) {
        cleanPages.push(dirtyPages[key]);
      }
    }

    return cleanPages
  }

  this.getSimpleList = () => this.getList({limit: 200, minimal: 1});

  this.getList = (params) => this.abstract.getList(params);
};
