const Abstract = require('./abstract');

module.exports = function(z, bundle) {
  this.singular = 'user';
  this.plural = 'users';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/users';
    this.abstract = new Abstract(z, bundle, this.route, this.singular, this.plural);
  }

  this.getSimpleList = () => this.getList({limit: 200, minimal: 1});

  this.getList = (params) => this.abstract.getList(params);
};
