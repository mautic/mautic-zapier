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

  it('fails auth on bad password', (done) => {
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

  it('fails auth on bad username', (done) => {
    zapier.tools.env.inject();
    const bundle = {
      authData: {
        baseUrl: process.env.TEST_BASE_URL,
        username: 'badpwd',
        password: process.env.TEST_BASIC_AUTH_PASSWORD
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

  it('fails auth on invalid url', (done) => {
    zapier.tools.env.inject();
    const bundle = {
      authData: {
        baseUrl: 'invalidurl',
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: process.env.TEST_BASIC_AUTH_PASSWORD
      }
    };

    appTester(App.authentication.test, bundle)
      .then(() => {
        done('Should not get here');
      })
      .catch((error) => {
        error.message.should.containEql('only absolute urls are supported\nWhat happened:\n  Starting GET request to invalidurl/api/contacts\n  only absolute urls are supported');
        done();
      });
  });

  it('fails auth on not existent url', (done) => {
    zapier.tools.env.inject();
    const url = 'https://thisurlshouldnot.be/mautic';
    const bundle = {
      authData: {
        baseUrl: url,
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: process.env.TEST_BASIC_AUTH_PASSWORD
      }
    };

    appTester(App.authentication.test, bundle)
      .then(() => {
        done('Should not get here');
      })
      .catch((error) => {
        error.message.should.startWith('request to '+url+'/api/contacts?limit=1&minimal=1 failed');
        done();
      });
  });

  it('fails auth on mautic url with /s', (done) => {
    zapier.tools.env.inject();
    const url = process.env.TEST_BASE_URL+'/s';
    const bundle = {
      authData: {
        baseUrl: url,
        username: process.env.TEST_BASIC_AUTH_USERNAME,
        password: process.env.TEST_BASIC_AUTH_PASSWORD
      }
    };

    appTester(App.authentication.test, bundle)
      .then(() => {
        done('Should not get here');
      })
      .catch((error) => {
        error.message.should.startWith('The URL you provided ('+url+') is not the base URL of a Mautic instance');
        done();
      });
  });
});
