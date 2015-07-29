/* global $ */
/* global H */
H = {
  _domIddCounter: 0,
  _ajaxInProgressCounter: 0,
  
  getDomId: function() {
    return 'dom-id-' + this._domIddCounter++;
  },
  
  slug: function(s) {
    return s.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
  },
  
  
  getJSON: function(url, callback) {
    JSONCache.getJSON(url, callback);
  },
  
  
  postJSON: function(url, data, successCallback) {
    JSONCache.invalidate();
    
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
  
  loadingbar: {
    inc: function() {
      H._ajaxInProgressCounter++;
      $('#loadingbar').show();
    },
    
    dec: function() {
      H._ajaxInProgressCounter--;
      
      if (H._ajaxInProgressCounter <= 0) {
        H._ajaxInProgressCounter = 0;
        $('#loadingbar').hide();
      }
    }
  } // loadingbar
};
