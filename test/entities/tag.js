const should = require('should');

const tagResponse = require('../../fixtures/requests/tags.js');
const Tag = require('../../entities/tag.js');

describe('Tag entity', () => {

  it('tests list tags response', () => {
    const tag = new Tag();
    const tags = tag.cleanTags(tagResponse);
    tags.should.be.an.Array();
    tags.length.should.be.equal(3);
    tags[2].id.should.be.equal('zapier');
    tags[2].name.should.be.equal('zapier');
  });

});
