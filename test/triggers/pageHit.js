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
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL+'/',
          },
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
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL+'/',
          },
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

    it('should load page hit event from fake hook', (done) => {
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

    it('should load page hit event from fake hook and filter by page ID which exists', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/pageHit.js'),
        inputData: {
          pageId: 1,
        },
      };

      appTester(App.triggers.pageHit.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([require('../../fixtures/samples/pageHit.js')]);
          done();
        })
        .catch(done);
    });

    it('should load page hit event from fake hook and filter by page ID which does not exist', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/pageHit.js'),
        inputData: {
          pageId: 10,
        },
      };

      appTester(App.triggers.pageHit.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([]);
          done();
        })
        .catch(done);
    });

    it('should load page hit event from list', (done) => {
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
