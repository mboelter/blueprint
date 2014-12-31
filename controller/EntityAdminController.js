var DB = require('../db.js'),
    Entity = new DB('Entity'),
    helper = require('../helper.js');


exports.json_all = function(req, res) {
  var entities = Entity.findAll();
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(entities) }); 
};

exports.json_one_by_id = function(req, res) {
  var entity = Entity.findById(req.params.id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(entity) }); 
};

exports.json_delete_by_id = function(req, res) {
  Entity.delete(req.params.id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify({}) }); 
};

exports.json_update = function(req, res) {
  var entity = Entity.findById(req.params.id);
  Entity.update(req.params.id, req.body);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(entity) }); 
};

exports.json_create = function(req, res) {
  var entity = req.body;

  if (entity.fields === undefined) {
    entity.fields = [];
  }

  if (!entity._slug) {
    // TODO slug needs to be uniq!!!!!
    entity._slug = helper.slug(entity.title);
  }
  
  var entities = Entity.findAll();
  entities.forEach(function(e) {
    if (entity._slug == e._slug) {
      // conflict of slug name, just keep adding underscores.....
      while (entity._slug == e._slug) {
        entity._slug = entity._slug + '_';
      }
    }
  });
    
  Entity.save(entity);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(entity) }); 
};