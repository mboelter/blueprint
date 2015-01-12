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


  sortArrayByObjectProperty: function(arr, property) {
    var byName = arr.slice(0);
    
    byName.sort(function(a,b) {
        var x = a[property].toLowerCase();
        var y = b[property].toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    
    return byName;
  },  
};
