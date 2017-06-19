const Abstract = require('./abstract');

Form = function(z, bundle) {
  this.singular = 'form';
  this.plural = 'forms';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/forms';
    this.abstract = new Abstract(z, bundle, this.route, this.singular, this.plural);
  }

  this.getSimpleList = () => this.getList({limit: 200, minimal: 1});

  this.getList = (params) => this.abstract.getList(params);

  this.getItem = (id) => this.abstract.getItem(id);
};

module.exports = Form;
