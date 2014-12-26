var DB = require('../db.js'),
    beautify = require('js-beautify').js_beautify;

exports.published = function(req, res) {
  var published = {},
      Entity = new DB('Entity'),
      entities = Entity.findAll();
  
  var resolve_references = function(items) {
    items = items.map(function(item) {
      for (var key in item) {
        if (Array.isArray(item[key])) {
          item[key] = resolve_references(item[key]);
        }

        if (key == '_ref') {
          var db = new DB(item[key]._entity);
              resolved_ref = db.findById(item[key]._id);
          
          return resolved_ref;
        }
      }
      
      return item;
    });
    
    return items;
  };
  
  
  entities.forEach(function(entity) {
    var db = new DB(entity._id),
        items = db.findAll();
    
    
    published[entity._slug] = resolve_references(items);
  });
  
  res.render('json/json.ejs', { layout: false, json: beautify(JSON.stringify(published)) }); 
};
