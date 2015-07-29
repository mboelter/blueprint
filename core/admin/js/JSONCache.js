/* global JSONCache */

JSONCache = {
  _inProgress: {},
  _cache: {},

  
  getJSON: function(url, callback) {
    var self = this;
    
    if (this.hasItem(url)) {
      callback(this._cache[url]);
    } else if (this.isInProgress(url)) {
      this._inProgress[url].push(callback);
    } else {
      this._inProgress[url] = [];
      this._inProgress[url].push(callback);
      
      $.getJSON(url, function(data) {
        self._cache[url] = data;
        
        while (self._inProgress[url].length > 0) {
          var cb = self._inProgress[url].shift();
          
          if (cb) {
            cb(data);
          }
        }
        
        delete self._inProgress[url];
      });
    }
  },

  
  isInProgress: function(url) {
    if (this._inProgress[url]) {
      return true;
    } else {
      return false;
    }
  },

  
  hasItem: function(url) {
    if (this._cache[url]) {
      return true;
    } else {
      return false;
    }
  },
  
  
  invalidate: function() {
    this._inProgress = {};
    this._cache = {};
  }
  
};
