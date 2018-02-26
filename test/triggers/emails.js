const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('email triggers', () => {

  describe('new helper email list trigger', () => {

    it('should load simple list of emails', (done) => {
      const bundle = {
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.emails.operation.perform, bundle)
        .then(emails => {
          if (emails) {
            for (var i in emails) {
              var form = emails[i];
              form.should.have.property('name');
              form.should.have.property('id');
              form.id.should.be.greaterThan(0);
            }
          } else {
            console.warning('Your Mautic instance does not contain any emails to test with')
          }

          done();
        })
        .catch(done);
    });

  }).timeout(15000);
});
