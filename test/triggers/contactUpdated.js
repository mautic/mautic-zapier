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

    // it('should load contact from fake hook', (done) => {
    //   zapier.tools.env.inject();
    //   const bundle = {
    //     authData: {
    //       baseUrl: process.env.TEST_BASE_URL,
    //       username: process.env.TEST_BASIC_AUTH_USERNAME,
    //       password: process.env.TEST_BASIC_AUTH_PASSWORD
    //     },
    //     cleanedRequest: {
    //       id: 1,
    //       name: 'name 1',
    //       directions: 'directions 1'
    //     }
    //   };

    //   appTester(App.triggers.contactUpdated.operation.perform, bundle)
    //     .then(results => {
    //       results.length.should.eql(1);

    //       const firstRecipe = results[0];
    //       firstRecipe.name.should.eql('name 1');
    //       firstRecipe.directions.should.eql('directions 1');

    //       done();
    //     })
    //     .catch(done);
    // });

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
