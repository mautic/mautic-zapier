const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('before request middleware', () => {

  it('Removes double slashes if the URL has a trailing slash', (done) => {
    zapier.tools.env.inject();
      const bundle = {
        authData: {
          baseUrl: process.env.TEST_BASE_URL+'/',
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        },
        meta: {
          isLoadingSample: true
        }
      };

      appTester(App.triggers.contactUpdated.operation.performList, bundle)
        .then(results => {
          results.length.should.be.greaterThan(0);

          const firstContact = results[0];
          firstContact.id.should.be.greaterThan(0);
          firstContact.should.have.property('email');

          done();
        })
        .catch(done);
  }).timeout(15000);
});
