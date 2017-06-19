Abstract = function(z, bundle, route, singular, plural) {

  this.getList = (params) => {
    const options = {
      url: route,
      params: params,
    };

    return z.request(options).then((response) => JSON.parse(response.content)[plural]);
  };

  this.getItem = (id) => {
    return z.request({url: route+'/'+id}).then((response) => JSON.parse(response.content)[singular]);
  };

};

module.exports = Abstract;
