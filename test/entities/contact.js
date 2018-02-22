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

});