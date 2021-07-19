const Field = require('../entities/field');

Contact = function(z, bundle) {
  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/contacts';
  }

  this.cleanContacts = (dirtyContacts) => {
    const contacts = [];

    for (var key in dirtyContacts) {
      contacts.push(this.cleanContact(dirtyContacts[key]));
    };

    return contacts;
  };

  this.cleanContact = (dirtyContact) => {
    var field = new Field;
    const coreFields = field.getContactCoreFields(true);
    const contact = {};

    // webhook payload stores the contact info to the 'contact' property. API does not.
    if (dirtyContact.contact) {
      dirtyContact = dirtyContact.contact;
    }

    // Fill in the core fields we want to provide
    coreFields.forEach((field) => {
      var type = typeof dirtyContact[field.key];
      if (dirtyContact[field.key] == null || (type !== 'undefined' && (type === 'string' || type === 'number'))) {
        contact[field.key] = dirtyContact[field.key];
      }
    });

    // Flatten the custom fields
    for (var groupKey in dirtyContact.fields) {
      var fieldGroup = dirtyContact.fields[groupKey];
      for (var fieldKey in fieldGroup) {
        var field = fieldGroup[fieldKey];

        // The API response has also 'all' fields which are in different format.
        if (field && typeof field.alias !== 'undefined') {
          contact[field.alias] = field.value;
        }
      }
    }
    
    // Flatten the owner info
    if (dirtyContact.owner && typeof dirtyContact.owner === 'object' && dirtyContact.owner.id) {
      contact.ownedBy = dirtyContact.owner.id;
      contact.ownedByUsername = dirtyContact.owner.username;
      contact.ownedByUser = dirtyContact.owner.firstName+' '+dirtyContact.owner.lastName;
    } else {
      contact.ownedBy = null;
      contact.ownedByUsername = null;
      contact.ownedByUser = null;
    }

    // Flatten the tags
    contact.tags = '';
    if (dirtyContact.tags && typeof dirtyContact.tags === 'object' && dirtyContact.tags.length) {
      for (var key in dirtyContact.tags) {
        if (typeof dirtyContact.tags[key].tag !== 'undefined' && dirtyContact.tags[key].tag) {
          if (contact.tags.length > 0) {
            contact.tags += ','
          }
          contact.tags += dirtyContact.tags[key].tag;
        }
      }
    }

    return contact;
  };

  this.modifyDataBeforeCreate = data => {

    const bcTagsExist = data.tags && typeof data.tags === 'string';
    const addTagsExist = data.addTags && Array.isArray(data.addTags) && data.addTags.length > 0;
    const removeTagsExist = data.removeTags && Array.isArray(data.removeTags) && data.removeTags.length > 0;

    // convert comma separated list of tags into array (BC)
    if (!(addTagsExist || removeTagsExist) && bcTagsExist) {
      data.tags = data.tags.split(',');
    } else {
      data.tags = [];
    }

    // merge addTags array into tags array
    if (addTagsExist) {
      data.tags = data.tags.concat(data.addTags);
      delete data.addTags;
    }

    // merge removeTags into tags array and add "-" prefix
    if (removeTagsExist) {
      data.removeTags = data.removeTags.map(x => '-'+x);
      data.tags = data.tags.concat(data.removeTags);
      delete data.removeTags;
    }

    // Trim spaces from tags
    data.tags = data.tags.map(tag => tag.trim())

    // Remove empty values so they won't delete some actual data
    return this.removeEmptyValues(data);
  };

  this.removeEmptyValues = data => Object.keys(data).reduce((result, key) => {
      let value = data[key]

      if (typeof value === 'string') {
        value = value.trim()
      }

      if (Array.isArray(value) && value.length === 0) {
        value = null
      }

      if (value) {
        result[key] = value
      }

      return result
    }, {})

  this.getList = (params) => {
    const options = {
      url: this.route,
      params: params,
    };

    return z.request(options)
      .then((response) => {
        return JSON.parse(response.content).contacts
    });
  };

  this.create = (data) => {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('No fields were mapped. Please fill in a value to some field(s).');
    }

    const requestData = {
      url: this.route+'/new',
      method: 'POST',
      body: JSON.stringify(this.modifyDataBeforeCreate(data)),
      headers: {
        'content-type': 'application/json'
      }
    };

    return z.request(requestData).then((response) => {
      return this.cleanContact(JSON.parse(response.content))
    });
  };
};

module.exports = Contact;
