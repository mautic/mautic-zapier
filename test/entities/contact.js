const should = require('should');

const Contact = require('../../entities/contact.js');

describe('Contact entity:', () => {

  it('tests modifyDataBeforeCreate', () => {
    const contact = new Contact();
    const sampleContactToSave = {
      'tags': 'tagD,-tagE',
      'addTags': ['tagA', 'tagB'],
      'removeTags': ['tagC'],
    };
    const contactToSave = contact.modifyDataBeforeCreate(sampleContactToSave);
    contactToSave.tags.should.be.an.Array();
    contactToSave.tags.should.be.eql(['tagD', '-tagE', 'tagA', 'tagB', '-tagC']);
  });

  it('tests removeEmptyValues', () => {
    const contact = new Contact();
    const sampleContactToSave = {
      firstname: 'John',
      lastname: '',
      email: 'john@doe.email',
      points: 0,
      tags: ' ',
      city: null,
      tags: [],
    };
    const contactToSave = contact.removeEmptyValues(sampleContactToSave);
    contactToSave.should.be.eql({
      firstname: 'John',
      email: 'john@doe.email',
    });
  });

});
