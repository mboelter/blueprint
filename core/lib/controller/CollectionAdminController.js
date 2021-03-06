var DB = require('../db.js'),
    helper = require('../helper.js');


exports.json_all = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_items = Collection.findAll();
  
  res.json(collection_items);    
};


exports.json_create = function(req, res) {
  var item = req.body,
      Collection = new DB(req.params.collection_slug),
      collections = Collection.findAll();

  if (!item._slug) {
    // TODO slug for collection item needs to be uniq!!!!!
    item._slug = helper.slug(item.title);
  }

  // conflict of slug name, just keep adding underscores.....
  collections.forEach(function(c) {
    if (item._slug == c._slug) {
      while (item._slug == c._slug) {
        item._slug = item._slug + '_';
      }
    }
  });

  Collection.save(item);
  res.json(item);
};


exports.json_one_by_id = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_item = Collection.findById(req.params.collection_item_id);
  
  res.json(collection_item);    
};


exports.json_delete_by_id = function(req, res) {
  var Collection = new DB(req.params.collection_slug);

  Collection.delete(req.params.collection_item_id);
  res.json({});
};


exports.json_update = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_item = Collection.update(req.params.collection_item_id, req.body);
  
  res.json(collection_item);    
};
