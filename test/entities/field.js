const should = require('should');

const Field = require('../../entities/field.js');

describe('Field entity', () => {

  it('tests list will set limit to 500 for empty params', (done) => {
    const z = {
      request: (options) => {
        options.params.limit.should.be.equal(500);
        done();
      }
    }
    const field = new Field(z);
    field.getList('contact');
  });

  it('tests list will set limit to 500 for params with a set limit', (done) => {
    const z = {
      request: (options) => {
        options.params.limit.should.be.equal(50);
        done();
      }
    }
    const field = new Field(z);
    field.getList('contact', {limit: 50});
  });

});
