const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('form triggers', () => {

  describe('new helper form list trigger', () => {

    it('should load simple list of forms', (done) => {
      const bundle = {
        authData: {
          access_token: process.env.ACCESS_TOKEN,
          baseUrl: process.env.BASE_URL,
        },
      };

      appTester(App.triggers.forms.operation.perform, bundle)
        .then(forms => {
          if (forms) {
            for (var i in forms) {
              var form = forms[i];
              form.should.have.property('name');
              form.should.have.property('id');
              form.id.should.be.greaterThan(0);
            }
          } else {
            console.warning('Your Mautic instance does not contain any forms to test with')
          }

          done();
        })
        .catch(done);
    }).timeout(15000);

  });
});
