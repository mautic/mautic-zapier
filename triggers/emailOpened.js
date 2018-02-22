const TriggerHelper = require('./triggerHelper');
const triggerHelper = new TriggerHelper('mautic.email_on_open', 'Trigger Zapier about email open events');
const Contact = require('../entities/contact');

const cleanEmailOpens = (dirtyOpens) => {
  const opens = [];

  for (var key in dirtyOpens) {
    opens.push(cleanEmailOpen(dirtyOpens[key]));
  };

  return opens;
};

const cleanEmail = (dirtyEmail) => {
  var email = {};

  email.id = dirtyEmail.id;
  email.name = dirtyEmail.name;
  email.subject = dirtyEmail.subject;
  email.language = dirtyEmail.language;
  email.fromAddress = dirtyEmail.fromAddress;
  email.fromName = dirtyEmail.fromName;
  email.replyToAddress = dirtyEmail.replyToAddress;
  email.bccAddress = dirtyEmail.bccAddress;
  email.customHtml = dirtyEmail.customHtml;
  email.plainText = dirtyEmail.plainText;
  email.template = dirtyEmail.template;
  email.emailType = dirtyEmail.emailType;
  email.publishUp = dirtyEmail.publishUp;
  email.publishDown = dirtyEmail.publishDown;
  email.readCount = dirtyEmail.readCount;
  email.sentCount = dirtyEmail.sentCount;

  return email;
};

const cleanEmailOpen = (dirtyOpen) => {
  var open = {};

  if (dirtyOpen.stat) {
    dirtyOpen = dirtyOpen.stat;
  }

  open.id = dirtyOpen.id;
  open.emailAddress = dirtyOpen.emailAddress;
  open.dateSent = dirtyOpen.dateSent;
  open.dateRead = dirtyOpen.dateRead;
  open.source = dirtyOpen.source;
  open.openCount = dirtyOpen.openCount;
  open.lastOpened = dirtyOpen.lastOpened;
  open.sourceId = dirtyOpen.sourceId;
  open.viewedInBrowser = dirtyOpen.viewedInBrowser;

  if (dirtyOpen.lead) {
    var contact = new Contact();
    open.contact = contact.cleanContact(dirtyOpen.lead);
  }

  if (dirtyOpen.email) {
    open.email = cleanEmail(dirtyOpen.email);
  }

  return open;
};

const getEmailOpen = (z, bundle) => {
  const dirtyOpens = bundle.cleanedRequest['mautic.email_on_open'];
  return cleanEmailOpens(dirtyOpens);
};

const getFallbackRealEmail = (z, bundle) => {
  return cleanEmailOpens(require('../fixtures/requests/emailOpened.js')['mautic.email_on_open']);
};

const getEmailFields = () => {
  return [
    {key: 'id', label: 'ID', type: 'integer'},
    {key: 'name', label: 'Name'},
    {key: 'subject', label: 'Subject'},
    {key: 'language', label: 'Language'},
    {key: 'fromAddress', label: 'From Address'},
    {key: 'fromName', label: 'From Name'},
    {key: 'replyToAddress', label: 'Reply To Address'},
    {key: 'bccAddress', label: 'BCC Address'},
    {key: 'customHtml', label: 'HTML Body'},
    {key: 'plainText', label: 'Plain Text Body'},
    {key: 'template', label: 'Template'},
    {key: 'emailType', label: 'Type'},
    {key: 'publishUp', label: 'Publish Up', type: 'datetime'},
    {key: 'publishDown', label: 'Publish Down', type: 'datetime'},
    {key: 'readCount', label: 'Read Count', type: 'integer'},
    {key: 'sentCount', label: 'Sent Count', type: 'integer'},
  ];
};

const getEmailOpenFields = () => {
  return [
    {key: 'id', label: 'ID', type: 'integer'},
    {key: 'emailAddress', label: 'Email Address'},
    {key: 'dateSent', label: 'Date Sent', type: 'datetime'},
    {key: 'dateRead', label: 'Date Read', type: 'datetime'},
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
  key: 'emailOpened',
  noun: 'Email',
  display: {
    label: 'Email Opened',
    description: 'Triggers when a contact email open.'
  },
  operation: {
    type: 'hook',
    performSubscribe: triggerHelper.subscribeHook,
    performUnsubscribe: triggerHelper.unsubscribeHook,
    perform: getEmailOpen,
    performList: getFallbackRealEmail,
    sample: require('../fixtures/samples/emailOpened.js'),
    outputFields: [getEmailOpenFields],
  }
};
