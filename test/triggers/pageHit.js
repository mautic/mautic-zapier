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

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    });

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

          done();
        })
        .catch(done);

    });

    it('should load email open event from fake hook', (done) => {
      const bundle = {
        cleanedRequest: App.triggers.pageHit.operation.sample
      };

      appTester(App.triggers.pageHit.operation.perform, bundle)
        .then(opens => {

          opens.should.eql(
            [
              {
                id: 7,
                dateHit: '2017-06-19T14:26:54+00:00',
                dateLeft: null,
                redirect: null,
                country: '',
                region: '',
                city: '',
                isp: '',
                organization: '',
                code: 200,
                referer: null,
                url: 'http://mautic.dev/index_dev.php/webhook-test',
                urlTitle: null,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                remoteHost: null,
                pageLanguage: 'en',
                source: null,
                sourceId: null,
                contact: {
                  id: 54,
                  points: 0,
                  title: null,
                  firstname: null,
                  lastname: null,
                  company: null,
                  position: null,
                  email: null,
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
                  multiselect: null,
                  f_select: null,
                  boolean: null,
                  datetime: null,
                  timezone1: null,
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
                }, page: {
                  id: 1,
                  title: 'Webhook test',
                  alias: 'webhook-test'
                }
              }
            ]
          );

          done();
        })
        .catch(done);
    });


    it('should load email open event from list', (done) => {
      const bundle = {};

      appTester(App.triggers.pageHit.operation.performList, bundle)
        .then(opens => {

          opens.should.eql(
            [
              {
                id: 7,
                dateHit: '2017-06-19T14:26:54+00:00',
                dateLeft: null,
                redirect: null,
                country: '',
                region: '',
                city: '',
                isp: '',
                organization: '',
                code: 200,
                referer: null,
                url: 'http://mautic.dev/index_dev.php/webhook-test',
                urlTitle: null,
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                remoteHost: null,
                pageLanguage: 'en',
                source: null,
                sourceId: null,
                contact: {
                  id: 54,
                  points: 0,
                  title: null,
                  firstname: null,
                  lastname: null,
                  company: null,
                  position: null,
                  email: null,
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
                  multiselect: null,
                  f_select: null,
                  boolean: null,
                  datetime: null,
                  timezone1: null,
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
                }, page: {
                  id: 1,
                  title: 'Webhook test',
                  alias: 'webhook-test'
                }
              }
            ]
          );

          done();
        })
        .catch(done);
    });

  });
});
