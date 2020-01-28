const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('email triggers', () => {

  describe('new helper email list trigger', () => {
    zapier.tools.env.inject();
    it('should load simple list of emails', (done) => {
      const bundle = {
        authData: {
          access_token: process.env.ACCESS_TOKEN,
          baseUrl: process.env.BASE_URL,
        },
      };

      appTester(App.triggers.emails.operation.perform, bundle)
        .then(emails => {
          if (emails) {
            for (var i in emails) {
              var email = emails[i];
              email.should.have.property('name');
              email.should.have.property('id');
              email.id.should.be.greaterThan(0);
            }
          } else {
            console.warning('Your Mautic instance does not contain any emails to test with')
          }

          done();
        })
        .catch(done);
    }).timeout(15000);

  });
});
