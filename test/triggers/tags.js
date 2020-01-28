const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('tag triggers', () => {

  it('should load a list of tags', (done) => {
    zapier.tools.env.inject();
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        baseUrl: process.env.BASE_URL,
      },
    };

    appTester(App.triggers.tags.operation.perform, bundle)
      .then(tags => {
        if (tags) {
          for (var i in tags) {
            var tag = tags[i];
            tag.should.have.property('id')
            tag.should.have.property('name')
            tag.id.should.be.equal(tag.name);
          }
        } else {
          console.warning('Your Mautic instance does not contain any tags to test with')
        }

        done();
      })
      .catch(done);
  }).timeout(15000);

});
