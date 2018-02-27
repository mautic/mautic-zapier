const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('page triggers', () => {

  describe('new helper page list trigger', () => {

    it('should load simple list of pages', (done) => {
      const bundle = {
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.pages.operation.perform, bundle)
        .then(pages => {
          if (pages) {
            for (var i in pages) {
              var page = pages[i];
              page.should.have.property('title');
              page.should.have.property('id');
              page.should.have.property('customHtml');
              page.id.should.be.greaterThan(0);
            }
          } else {
            console.warning('Your Mautic instance does not contain any pages to test with')
          }

          done();
        })
        .catch(done);
    });

  }).timeout(15000);
});
