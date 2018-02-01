const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('tag triggers', () => {

  it('should load a list of tags', (done) => {
    const bundle = {
      authData: {
        baseUrl: process.env.TEST_BASE_URL,
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: process.env.TEST_BASIC_AUTH_PASSWORD
      }
    };

    appTester(App.triggers.tags.operation.perform, bundle)
      .then(tags => {
        if (tags) {
          for (var i in tags) {
            var tag = tags[i];
            tag.id.length.should.be.greaterThan(0);
            tag.name.length.should.be.greaterThan(0);
            tag.id.should.be.equal(tag.name);
          }
        } else {
          console.warning('Your Mautic instance does not contain any tags to test with')
        }

        done();
      })
      .catch(done);
  });

});
