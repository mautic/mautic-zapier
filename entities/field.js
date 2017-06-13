Field = function(z, bundle) {

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/fields';
  }

  this.getContactCoreFields = () => {
    return [
      {key: 'id', label: 'ID'},
      {key: 'dateAdded', label: 'Date Added'},
      {key: 'dateModified', label: 'Date Modified'},
      {key: 'dateIdentified', label: 'Date Identified'},
      {key: 'lastActive', label: 'Last Active Date'},
      {key: 'createdBy', label: 'Created By ID'},
      {key: 'createdByUser', label: 'Created By User'},
      {key: 'modifiedBy', label: 'Modified By ID'},
      {key: 'modifiedByUser', label: 'Modified By User'},
      {key: 'points', label: 'Points'},
      {key: 'ownedBy', label: 'OwnedBy ID'},
      {key: 'ownedByUser', label: 'OwnedBy User'},
      {key: 'ownedByUsername', label: 'OwnedBy Username'},
    ];
  };

  this.simplifyFieldArray = (response) => {
    const contact = new Contact();
    const fields = this.getContactCoreFields();

    if (response && response.fields) {
      for (var key in response.fields) {
        var field = response.fields[key];
        fields.push({key: field.alias, label: field.label});
      }
    }

    return fields;
  };

  this.getList = (object, params) => {
    const options = {
      url: this.route+'/'+object,
      params: params,
    };

    return z.request(options)
      .then((response) => {
        return this.simplifyFieldArray(JSON.parse(response.content).contacts)
    });
  };
};

module.exports = Field;
