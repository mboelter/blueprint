H = {
  _domIddCounter: 0,
  
  getDomId: function() {
    return 'dom-id-' + this._domIddCounter++;
  },
  
  slug: function(s) {
    return s.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
  },
  
  postJSON: function(url, data, successCallback) {
    $.ajax(url, {
      data: JSON.stringify(data),
      contentType: 'application/json',
      type : 'POST',
      success: successCallback,
    });
  },
  
};
