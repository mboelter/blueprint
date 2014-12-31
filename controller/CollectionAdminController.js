var DB = require('../db.js'),
    helper = require('../helper.js');


exports.json_all = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_items = Collection.findAll();
      
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(collection_items) }); 
};


exports.json_create = function(req, res) {
  var item = req.body,
      Collection = new DB(req.params.collection_slug);

  if (!item._slug) {
    // TODO slug for collection item needs to be uniq!!!!!
    item._slug = helper.slug(item.title);
  }

  Collection.save(item);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(item) }); 
};


exports.json_one_by_id = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_item = Collection.findById(req.params.collection_item_id);
      
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(collection_item) }); 
};


exports.json_delete_by_id = function(req, res) {
  var Collection = new DB(req.params.collection_slug);

  Collection.delete(req.params.collection_item_id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify({}) }); 
};


exports.json_update = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_item = Collection.update(req.params.collection_item_id, req.body);
      
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(collection_item) }); 
};
