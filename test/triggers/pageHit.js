const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Page triggers', () => {

  describe('new page hit trigger', () => {

    var subscribeData = null;

    it('should create an page hit hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.pageHit.operation.performSubscribe, bundle)
        .then(response => {
          response.should.have.property('hook');
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about page hit events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.page_on_hit']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should delete the page hit hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
        subscribeData: subscribeData,
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      // Delete the created hook to clean up after previous test and to test delete too
      appTester(App.triggers.pageHit.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about page hit events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.page_on_hit']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should load email open event from fake hook', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/pageHit.js')
      };

      appTester(App.triggers.pageHit.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([require('../../fixtures/samples/pageHit.js')]);
          done();
        })
        .catch(done);
    });


    it('should load email open event from list', (done) => {
      const bundle = {};

      appTester(App.triggers.pageHit.operation.performList, bundle)
        .then(opens => {
          opens.should.eql([require('../../fixtures/samples/pageHit.js')]);
          done();
        })
        .catch(done);
    });

  });
});
