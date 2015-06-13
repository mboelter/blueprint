var DB = require('../db.js'),
    Entity = new DB('Entity'),
    helper = require('../helper.js');


exports.json_all = function(req, res) {
  var entities = Entity.findAll();
  res.json(entities);
};

exports.json_one_by_id = function(req, res) {
  var entity = Entity.findBySlug(req.params.slug);
  res.json(entity);
};

exports.json_delete_by_slug = function(req, res) {
  var entity = Entity.findBySlug(req.params.slug),
      collection = new DB(entity.collection_slug);
  
  collection.destroy();

  Entity.deleteBySlug(req.params.slug);
  res.json({});
};

exports.json_update_by_slug = function(req, res) {
  Entity.updateBySlug(req.params.slug, req.body);
  var entity = Entity.findBySlug(req.params.slug);
  res.json(entity);
};

exports.json_create = function(req, res) {
  var entity = req.body;

  if (entity.fields === undefined) {
    entity.fields = [];
  }

  entity._slug = helper.slug(helper.pluralize(entity.title));
  
  // conflict of slug name or collection slug name, just keep adding underscores.....
  var entities = Entity.findAll();

  entities.forEach(function(e) {
    if (entity._slug == e._slug) {
      while (entity._slug == e._slug) {
        entity._slug = entity._slug + '_';
      }
    }

    if (entity.collection_slug == e.collection_slug) {
      while (entity.collection_slug == e.collection_slug) {
        entity.collection_slug = entity.collection_slug + '_';
      }
    }
  });
  
        
  Entity.save(entity);
  res.json(entity);
};