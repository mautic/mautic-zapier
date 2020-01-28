const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('user triggers', () => {

  describe('new helper user list trigger', () => {

    it('should load simple list of users', (done) => {
      const bundle = {
        authData: {
          access_token: process.env.ACCESS_TOKEN,
          baseUrl: process.env.BASE_URL+'/',
        },
      };

      appTester(App.triggers.users.operation.perform, bundle)
        .then(users => {
          if (users) {
            for (var i in users) {
              var email = users[i];
              email.should.have.property('firstName');
              email.should.have.property('lastName');
              email.should.have.property('email');
              email.should.have.property('id');
              email.id.should.be.greaterThan(0);
            }
          } else {
            console.warning('Your Mautic instance does not contain any users to test with')
          }

          done();
        })
        .catch(done);
    }).timeout(15000);

  });
});
