var fs = require('fs'),
    helper = require('./helper.js');

var DB = function(name) {
  this._name = name;
  this._path = 'bp-content/db/'
  this._filename = this._path + '/' + name + '.json';
  this._collection = [];
  
  if (!fs.existsSync(this._filename)) {
    this._initDB();
  };
  
  this._loadDB();

  return this;
};



DB.prototype = {
  _initDB: function() {
    if (!fs.existsSync(this._path)) {
      fs.mkdirSync(this._path)
    }
    fs.writeFileSync(this._filename, JSON.stringify([]), 'utf8');    
  },
  
  
  _loadDB: function() {
    this._collection = JSON.parse(fs.readFileSync(this._filename));
  },
  
  
  _writeDB: function() {
    fs.writeFileSync(this._filename, JSON.stringify(this._collection), 'utf8');    
  },
  

  _UUID: function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  },
  
  
  // destroy whole DB, use with care!!
  destroy: function() {
    fs.unlinkSync(this._filename);
  },
  
  
  save: function(json) {
    if (!json._id) {
      json._id = this._UUID();
      this._collection.push(json);      
    }
    
    this._writeDB();
    
    return json;
  },
  
  
  delete: function(id) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (id == this._collection[i]._id) {
        this._collection.splice(i, 1);
        this._writeDB();
        
        return true;
      }
    }
  },


  deleteBySlug: function(slug) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (slug == this._collection[i]._slug) {
        this._collection.splice(i, 1);
        this._writeDB();
        
        return true;
      }
    }
  },
  
  
  update: function(id, json) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (id == this._collection[i]._id) {
        this._collection.splice(i, 1, json);
        this._writeDB();
        
        return json;
      }
    }
    
    return false;
  },


  updateBySlug: function(slug, json) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (slug == this._collection[i]._slug) {
        this._collection.splice(i, 1, json);
        this._writeDB();
        
        return json;
      }
    }
    
    return false;
  },
  
  
  findAll: function() {
    return this._collection;
  },
  
  
  findById: function(id) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (id == this._collection[i]._id) {
        return this._collection[i]; 
      }
    }
    
    return undefined;
  },


  findBySlug: function(slug) {
    for (var i = 0, len = this._collection.length; i < len; i++) {
      if (slug == this._collection[i]._slug) {
        return this._collection[i]; 
      }
    }
    
    return undefined;
  }
};


module.exports = DB;
