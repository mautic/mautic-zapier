const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('creates', () => {

  describe('create contact', () => {
    it('should create a new contact', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        inputData: {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@doe.email',
          points: 7,
        },
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.creates.contact.operation.perform, bundle)
        .then((result) => {
          result.firstname.should.equal('John');
          result.lastname.should.equal('Doe');
          result.email.should.equal('john@doe.email');
          result.points.should.equal(7);
          done();
        })
        .catch(done);
    });
  });
});