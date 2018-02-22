const should = require('should');

const Tag = require('../../entities/tag.js');

describe('Tag entity', () => {

  it('tests list tags response', () => {
    const tag = new Tag();
    const tags = tag.cleanTags(require('../../fixtures/requests/tags.js'));
    tags.should.be.an.Array();
    tags.length.should.be.equal(3);
    tags[2].id.should.be.equal('zapier');
    tags[2].name.should.be.equal('zapier');
  });

  it('cleanTags should remove duplicates', () => {
    const tag = new Tag();
    const tags = tag.cleanTags(require('../../fixtures/requests/tagsWithDuplicates.js'));
    tags.should.be.an.Array();
    tags.length.should.be.equal(2);
    tags[0].id.should.be.equal('APItag');
    tags[1].id.should.be.equal('zapier');
    tags[0].name.should.be.equal('APItag');
    tags[1].name.should.be.equal('zapier');
  });

});
