const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('contact triggers', () => {

  describe('new contact updated trigger', () => {

  var subscribeData = null;

    it('should create and delete a contact update hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.contactUpdated.operation.performSubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about contact update events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_post_save_update']);

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    });

    it('should delete a contact update hook', (done) => {
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
      appTester(App.triggers.contactUpdated.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about contact update events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.lead_post_save_update']);

          done();
        })
        .catch(done);

    });

    it('should get a list of contact custom fields', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        authData: {
          baseUrl: process.env.TEST_BASE_URL,
          username: process.env.TEST_BASIC_AUTH_USERNAME,
          password: process.env.TEST_BASIC_AUTH_PASSWORD
        }
      };

      appTester(App.triggers.contactUpdated.operation.outputFields, bundle)
        .then(fields => {

          should.exist(fields[0].key);
          should.exist(fields[0].label);

          done();
        })
        .catch(done);

    });

    it('should load contact from fake hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        cleanedRequest: App.triggers.contactUpdated.operation.sample
      };

      appTester(App.triggers.contactUpdated.operation.perform, bundle)
        .then(contacts => {

          contacts.should.eql(
            [
              {
                id: 12,
                dateAdded: '2017-06-09T11:46:53+00:00',
                dateModified: '2017-06-09T11:49:02+00:00',
                dateIdentified: '2017-06-09T11:46:53+00:00',
                createdBy: 1,
                createdByUser: 'John Doe',
                modifiedBy: 1,
                modifiedByUser: 'John Doe',
                points: 0,
                title: null,
                firstname: 'John',
                lastname: 'Doe',
                company: 'Mautic',
                position: null,
                email: 'john@doe.email',
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
                attribution_date: '',
                attribution: null,
                website: null,
                facebook: null,
                foursquare: null,
                googleplus: null,
                instagram: null,
                linkedin: null,
                skype: null,
                twitter: null,
                ownedBy: 1,
                ownedByUsername: 'admin',
                ownedByUser: 'John Doe'
              }
            ]
          );

          done();
        })
        .catch(done);
    });

    // it('should load recipe from list', (done) => {
    //   const bundle = {
    //     inputData: {
    //       style: 'mediterranean'
    //     },
    //     meta: {
    //       frontend: true
    //     }
    //   };

    //   appTester(App.triggers.recipe.operation.performList, bundle)
    //     .then(results => {
    //       results.length.should.be.greaterThan(1);

    //       const firstRecipe = results[0];
    //       firstRecipe.name.should.eql('name 1');
    //       firstRecipe.directions.should.eql('directions 1');

    //       done();
    //     })
    //     .catch(done);
    // });
  });

});
