const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('contact triggers', () => {

  describe('new contact points changed trigger', () => {

    var subscribeData = null;

    it('should create a contact points changed hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL+'/',
          },
      };

      appTester(App.triggers.pointsChanged.operation.performSubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about contact points changed events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_points_change']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should delete a contact points changed hook', (done) => {
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
      appTester(App.triggers.pointsChanged.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about contact points changed events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_points_change']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should load contact from fake hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/pointsChanged.js')
      };

      appTester(App.triggers.pointsChanged.operation.perform, bundle)
        .then(contacts => {
          contacts.should.eql([require('../../fixtures/samples/pointsChanged.js')]);
          done();
        })
        .catch(done);
    });
  });
});
