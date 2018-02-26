const Abstract = require('./abstract');

module.exports = function(z, bundle) {
  this.singular = 'email';
  this.plural = 'emails';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/emails';
    this.abstract = new Abstract(z, bundle, this.route, this.singular, this.plural);
  }

  /**
   * Zapier will fail if it gets a JSON object. Must be a JSON array.
   * And we don't care about IDs since the tag label itself is the unique key.
   */
  this.convertResponseToArray = (dirtyEmails) => {
    const cleanEmails = []

    if (dirtyEmails) {
      for (var key in dirtyEmails) {
        cleanEmails.push(dirtyEmails[key]);
      }
    }

    return cleanEmails;
  }

  this.getSimpleList = () => this.getList({limit: 200, minimal: 1});

  this.getList = (params) => this.abstract.getList(params);
};
