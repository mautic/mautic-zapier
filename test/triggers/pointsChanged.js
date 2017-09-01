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
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.pointsChanged.operation.performSubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about contact points changed events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_points_change']);

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    });

    it('should delete a contact points changed hook', (done) => {
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
      appTester(App.triggers.pointsChanged.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about contact points changed events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_points_change']);

          done();
        })
        .catch(done);

    });

    it('should load contact from fake hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        cleanedRequest: require('../../fixtures/pointsChanged.js')
      };

      appTester(App.triggers.pointsChanged.operation.perform, bundle)
        .then(contacts => {
          contacts.should.eql(
            [
              {
                id: 15,
                dateAdded: '2017-06-13T11:27:07+00:00',
                dateModified: '2017-06-13T11:27:07+00:00',
                dateIdentified: '2017-06-13T11:27:07+00:00',
                lastActive: '2017-06-13T11:27:07+00:00',
                createdByUser: ' ',
                modifiedByUser: ' ',
                points: 5,
                title: null,
                firstname: null,
                lastname: null,
                company: null,
                position: null,
                email: 'john@doe.net',
                mobile: null,
                phone: null,
                fax: null,
                address1: null,
                address2: null,
                city: null,
                state: null,
                zipcode: null,
                country: null,
                preferred_locale: null,
                attribution_date: null,
                attribution: null,
                website: null,
                facebook: null,
                foursquare: null,
                googleplus: null,
                instagram: null,
                linkedin: null,
                skype: null,
                twitter: null,
                ownedBy: null,
                ownedByUsername: null,
                ownedByUser: null,
                tags: ''
              }
            ]
          );

          done();
        })
        .catch(done);
    });
  });
});
