const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('contact triggers', () => {

  describe('new contact updated trigger', () => {

    var subscribeData = null;

    it('should create a contact update hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
          },
      };

      appTester(App.triggers.contactUpdated.operation.performSubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about contact update events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_post_save_update']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should delete a contact update hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
        subscribeData: subscribeData,
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
          },
      };

      // Delete the created hook to clean up after previous test and to test delete too
      appTester(App.triggers.contactUpdated.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about contact update events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_post_save_update']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should get a list of contact custom fields', (done) => {
      zapier.tools.env.inject();
      const bundle = {
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
          },
      };

      appTester(App.triggers.contactUpdated.operation.outputFields, bundle)
        .then(fields => {

          should.exist(fields[0].key);
          should.exist(fields[0].label);

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should load contact from fake hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/contactUpdated.js')
      };

      appTester(App.triggers.contactUpdated.operation.perform, bundle)
        .then(contacts => {
          contacts.should.eql([require('../../fixtures/samples/contactUpdated.js')]);
          done();
        })
        .catch(done);
    });

    it('should load contact from list', (done) => {
      zapier.tools.env.inject();
      const bundle = {
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
          },
        meta: {
          isLoadingSample: true
        }
      };

      appTester(App.triggers.contactUpdated.operation.performList, bundle)
        .then(results => {
          results.length.should.be.greaterThan(0);

          const firstContact = results[0];
          firstContact.id.should.be.greaterThan(0);
          firstContact.should.have.property('email');

          done();
        })
        .catch(done);
    }).timeout(15000);
  });

});
