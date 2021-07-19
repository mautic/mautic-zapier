const should = require('should');

const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Email triggers', () => {

  describe('new email open trigger', () => {

    var subscribeData = null;

    it('should create an email open hook', (done) => {
      zapier.tools.env.inject();
      const bundle = {
        targetUrl: 'http://provided.by?zapier',
        authData: {
          access_token: process.env.ACCESS_TOKEN,
          baseUrl: process.env.BASE_URL+'/',
        },
      };

      appTester(App.triggers.emailOpened.operation.performSubscribe, bundle)
        .then(response => {
          response.should.have.property('hook');
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.id.should.be.greaterThan(0);
          response.hook.name.should.eql('Trigger Zapier about email open events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.email_on_open']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          // Set subscribeDate for the unsubscribe test
          subscribeData = response;

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should delete the email open hook', (done) => {
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
      appTester(App.triggers.emailOpened.operation.performUnsubscribe, bundle)
        .then(response => {
          should.exist(response.hook);
          response.hook.webhookUrl.should.eql(bundle.targetUrl);
          response.hook.name.should.eql('Trigger Zapier about email open events');
          response.hook.description.should.eql('Created via Zapier');
          response.hook.triggers.should.eql(['mautic.email_on_open']);
          response.hook.eventsOrderbyDir.should.eql('DESC');

          done();
        })
        .catch(done);

    }).timeout(15000);

    it('should load email open event from fake hook', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/emailOpened.js')
      };

      appTester(App.triggers.emailOpened.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([require('../../fixtures/samples/emailOpened.js')]);
          done();
        })
        .catch(done);
    });

    it('should load email open event from fake hook and filter by email ID which exists', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/emailOpened.js'),
        inputData: {
          emailId: 9,
        },
      };

      appTester(App.triggers.emailOpened.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([require('../../fixtures/samples/emailOpened.js')]);
          done();
        })
        .catch(done);
    });

    it('should load email open event from fake hook and filter by email ID which does not exist', (done) => {
      const bundle = {
        cleanedRequest: require('../../fixtures/requests/emailOpened.js'),
        inputData: {
          emailId: 10,
        },
      };

      appTester(App.triggers.emailOpened.operation.perform, bundle)
        .then(opens => {
          opens.should.eql([]);
          done();
        })
        .catch(done);
    });

    it('should load email open event from list', (done) => {
      const bundle = {};

      appTester(App.triggers.emailOpened.operation.performList, bundle)
        .then(opens => {

          opens.should.eql(
            [
              {
                id: 38,
                emailAddress: 'doe@gmail.com',
                dateSent: '2017-06-19T12:36:13+00:00',
                dateRead: '2017-06-19T12:36:33+00:00',
                source: 'email',
                openCount: 1,
                lastOpened: '2017-06-19T12:36:33+00:00',
                sourceId: 9,
                viewedInBrowser: true,
                contact: {
                  id: 4,
                  points: 0,
                  title: null,
                  firstname: null,
                  lastname: null,
                  company: null,
                  position: null,
                  email: 'doe@gmail.com',
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
                },
                email: {
                  id: 9,
                  name: 'Webhook test',
                  subject: 'Webhook test',
                  language: 'en',
                  fromAddress: null,
                  fromName: null,
                  replyToAddress: null,
                  bccAddress: null,
                  customHtml: '<!DOCTYPE html>\n<html>\n    <head>\n        <title>{subject}</title>\n        <style type="text/css" media="only screen and (max-width: 480px)">\n            /* Mobile styles */\n            @media only screen and (max-width: 480px) {\n\n                [class="w320"] {\n                    width: 320px !important;\n                }\n\n                [class="mobile-block"] {\n                    width: 100% !important;\n                    display: block !important;\n                }\n            }\n        </style>\n    </head>\n    <body style="margin:0">\n        <div data-section-wrapper="1">\n            <center>\n                <table data-section="1" style="width: 600;" width="600" cellpadding="0" cellspacing="0">\n                    <tbody>\n                        <tr>\n                            <td>\n                                <div data-slot-container="1" style="min-height: 30px">\n                                    <div data-slot="text">\n                                        <br />\n                                        <h2>Hello there!</h2>\n                                        <br />\n                                        We haven\'t heard from you for a while...\n                                        <br />\n                                        <br />\n                                        {unsubscribe_text} | {webview_text}\n                                        <br />\n                                    </div>\n                                </div>\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n            </center>\n        </div>\n    </body>\n</html>',
                  plainText: null,
                  template: 'blank',
                  emailType: 'list',
                  publishUp: null,
                  publishDown: null,
                  readCount: 0,
                  sentCount: 5
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
