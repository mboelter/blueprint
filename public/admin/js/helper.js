H = {
  _domIddCounter: 0,
  
  getDomId: function() {
    return 'dom-id-' + this._domIddCounter++;
  },
  
  slug: function(s) {
    return s.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
  },
};