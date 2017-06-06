const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('basic auth app', () => {

  it('auth succcessfully', (done) => {
    zapier.tools.env.inject();
    const bundle = {
      authData: {
        baseUrl: process.env.TEST_BASE_URL,
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: process.env.TEST_BASIC_AUTH_PASSWORD
      }
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        response.status.should.eql(200);
        should.exist(response.json.total);
        should.not.exist(response.json.error);
        done();
      })
      .catch(done);
  });

  it('fails on bad auth', (done) => {
    zapier.tools.env.inject();
    const bundle = {
      authData: {
        baseUrl: process.env.TEST_BASE_URL,
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: 'badpwd'
      }
    };

    appTester(App.authentication.test, bundle)
      .then(() => {
        done('Should not get here');
      })
      .catch((error) => {
        error.message.should.containEql('API authorization denied.');
        done();
      });
  });
});
