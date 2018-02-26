const should = require('should');

const Contact = require('../../entities/contact.js');

describe('Contact entity:', () => {

  it('tests modifyDataBeforeCreate must support the old tags field for BC', () => {
    const contact = new Contact();
    const sampleContactToSave = {
      'tags': 'tagD, -tagE',
    };
    const contactToSave = contact.modifyDataBeforeCreate(sampleContactToSave);
    contactToSave.tags.should.be.an.Array();
    contactToSave.tags.should.be.eql(['tagD', '-tagE']);
  });

  it('tests modifyDataBeforeCreate must support the new tags fields', () => {
    const contact = new Contact();
    const sampleContactToSave = {
      'addTags': ['tagA', 'tagB '],
      'removeTags': ['tagC'],
    };
    const contactToSave = contact.modifyDataBeforeCreate(sampleContactToSave);
    contactToSave.tags.should.be.an.Array();
    contactToSave.tags.should.be.eql(['tagA', 'tagB', '-tagC']);
    contactToSave.should.not.have.property('addTags')
    contactToSave.should.not.have.property('removeTags')
  });

  it('tests modifyDataBeforeCreate must ignore the ord tags field if the new tags fields are present', () => {
    const contact = new Contact();
    const sampleContactToSave = {
      'tags': 'tagD,-tagE',
      'addTags': ['tagA', 'tagB'],
    };
    const contactToSave = contact.modifyDataBeforeCreate(sampleContactToSave);
    contactToSave.tags.should.be.an.Array();
    contactToSave.tags.should.be.eql(['tagA', 'tagB']);
    contactToSave.should.not.have.property('addTags')
    contactToSave.should.not.have.property('removeTags')
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
