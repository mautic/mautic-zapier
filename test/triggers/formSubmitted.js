const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('form triggers', () => {

  describe('new form submission trigger', () => {

    var subscribeData = null;

    it('should create a form submitted hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
          authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
          },
      };

      appTester(App.triggers.formSubmitted.operation.performSubscribe, bundle)
        .then(response => {
          response.should.have.property('hook');
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about form submit events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.form_on_submit']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should delete the form submitted hook', (done) => {
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
      appTester(App.triggers.formSubmitted.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about form submit events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.form_on_submit']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should load a submission via API', (done) => {
      const bundle = {
        authData: {
              access_token: process.env.ACCESS_TOKEN,
              baseUrl: process.env.BASE_URL,
        },
        inputData: {
          formId: 1,
        },
      };

      appTester(App.triggers.formSubmitted.operation.performList, bundle)
        .then(submissions => {

          var submission = submissions[0];

          submission.id.should.be.greaterThan(0);
          submission.formId.should.be.greaterThan(0);
          submission.should.have.property('formAlias');
          submission.should.have.property('formName');
          submission.should.have.property('dateSubmitted');
          submission.should.have.property('referrer');
          submission.should.have.property('page');
          submission.should.have.property('results');
          submission.should.have.property('contact');
          submission.results.should.not.be.empty();
          submission.contact.should.not.be.empty();
          submission.contact.id.should.be.greaterThan(0);

          done();
        })
        .catch(done);
    }).timeout(15000);

    it('should load submission from fake hook', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/formSubmitted.js'),
        inputData: {formId: 3},
      };

      appTester(App.triggers.formSubmitted.operation.perform, bundle)
        .then(submissions => {
          submissions.should.eql([require('../../fixtures/samples/formSubmitted.js')]);
          done();
        })
        .catch(done);
    });

    it('should refuse submission from fake hook because of form ID mismatch', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/formSubmitted.js'),
        inputData: {},
      };

      appTester(App.triggers.formSubmitted.operation.perform, bundle)
        .then(submissions => {

          submissions.should.eql([]);

          done();
        })
        .catch(done);
    });
  });
});
