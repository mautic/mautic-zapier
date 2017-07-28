const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.page_on_hit', 'Trigger Zapier about page hit events');
const Contact = require('../entities/contact');
const sample = require('../fixtures/pageHit.js');

const cleanPageHits = (dirtyHits) => {
  const hits = [];

  for (var key in dirtyHits) {
    hits.push(cleanPageHit(dirtyHits[key]));
  };

  return hits;
};

const cleanPage = (dirtyPage) => {
  var page = {};

  page.id = dirtyPage.id;
  page.title = dirtyPage.title;
  page.alias = dirtyPage.alias;

  return page;
};

const cleanPageHit = (dirtyHit) => {
  var hit = {};

  if (dirtyHit.hit) {
    dirtyHit = dirtyHit.hit;
  }

  hit.id = dirtyHit.id;
  hit.dateHit = dirtyHit.dateHit;
  hit.dateLeft = dirtyHit.dateLeft;
  hit.redirect = dirtyHit.redirect;
  hit.country = dirtyHit.country;
  hit.region = dirtyHit.region;
  hit.city = dirtyHit.city;
  hit.isp = dirtyHit.isp;
  hit.organization = dirtyHit.organization;
  hit.code = dirtyHit.code;
  hit.referer = dirtyHit.referer;
  hit.url = dirtyHit.url;
  hit.urlTitle = dirtyHit.urlTitle;
  hit.userAgent = dirtyHit.userAgent;
  hit.remoteHost = dirtyHit.remoteHost;
  hit.pageLanguage = dirtyHit.pageLanguage;
  hit.source = dirtyHit.source;
  hit.sourceId = dirtyHit.sourceId;

  if (dirtyHit.lead) {
    var contact = new Contact();
    hit.contact = contact.cleanContact(dirtyHit.lead);
  }

  if (dirtyHit.page) {
    hit.page = cleanPage(dirtyHit.page);
  }

  return hit;
};

const getPageHit = (z, bundle) => {
  const dirtyHits = bundle.cleanedRequest['mautic.page_on_hit'];
  return cleanPageHits(dirtyHits);
};

const getFallbackRealPage = (z, bundle) => {
  return cleanPageHits(sample['mautic.page_on_hit']);
};

const getEmailFields = () => {
  return [
    {key: 'id', label: 'ID', type: 'integer'},
    {key: 'title', label: 'Title'},
    {key: 'alias', label: 'Alias'},
  ];
};

const getPageHitFields = () => {
  return [
    {key: 'id', label: 'ID', type: 'integer'},
    {key: 'emailAddress', label: 'Email Address'},
    {key: 'dateHit', label: 'Date Hit', type: 'datetime'},
    {key: 'dateLeft', label: 'Date Left', type: 'datetime'},
    {key: 'lastOpened', label: 'Last Opened', type: 'datetime'},
    {key: 'openCount', label: 'Open Count', type: 'integer'},
    {key: 'source', label: 'Source object'},
    {key: 'sourceId', label: 'Source Object ID', type: 'integer'},
    {key: 'viewedInBrowser', label: 'Viewed In Browser', type: 'boolean'},
    {key: 'email', label: 'Email', children: getEmailFields},
    {key: 'contact', label: 'Contact', children: triggerHelper.getContactCustomFields},
  ];
};

module.exports = {
  key: 'pageHit',
  noun: 'Page',
  display: {
    label: 'Page Hit',
    description: 'Triggers on a contact page hit.'
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: getPageHit,
    performList: getFallbackRealPage,
    sample: sample,
    outputFields: getPageHitFields
  }
};
