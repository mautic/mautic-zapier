Stats = function(z, bundle) {
  this.singular = 'stat';
  this.plural = 'stats';

  if (bundle) {
    this.route = bundle.authData.baseUrl+'/api/stats';
  }

  this.urlencode = (params, prefix) => {
    var str = [], p;
    for (p in params) {
      if (params.hasOwnProperty(p)) {
        var k = prefix ? prefix+'['+p+']' : p, v = params[p];
        str.push((v !== null && typeof v === 'object') ?
          this.urlencode(v, k) : encodeURIComponent(k)+'='+encodeURIComponent(v));
      }
    }
    return str.join('&');
  }

  this.getOneSubmission = (formId) => {
    const params = {
      start: 0,
      limit: 1,
      order: [
        {
          col: 'date_submitted',
          dir: 'DESC',
        }
      ],
      where: [
        {
          col: 'form_id',
          expr: 'eq',
          val: formId,
        }
      ]
    };
    const options = {
      url: this.route+'/form_submissions?'+this.urlencode(params),
    };

    return z.request(options).then((response) => JSON.parse(response.content)[this.plural]);
  }
};

module.exports = Stats;