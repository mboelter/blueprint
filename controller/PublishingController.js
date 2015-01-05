var DB = require('../db.js'),
    beautify = require('js-beautify').js_beautify,
    fs = require('fs');


var resolve_references = function(items, depth) {
  depth = depth || 0;
  depth++;
  
  // some safeguard for circular references.
  if (depth == 10) {
    console.log('WARNING: PublishingController.resolve_references(): Depth too deep, no resolving anymore.')
    return items;
  }
  
  if (Array.isArray(items)) {
    return items.map(function(item) {
      return resolve_references(item, depth);
    });
  }
  
  var item = items; // seems we only deal with one item;

  for (var key in item) {
    if (Array.isArray(item[key])) {
      item[key] = resolve_references(item[key], depth);
    } else if (key == '_ref') {
      var resolved_ref = new DB(item[key]._collection_slug).findById(item[key]._item_id);
      item = resolve_references(resolved_ref, depth);
    }
  };
  
  return item;
};




exports.publish = function(req, res) {
  var spawn = require('child_process').spawn,
      settings = JSON.parse(fs.readFileSync('./bp-settings.json')),
      command = spawn('sh', ['-c', settings.publish_hook]),
      stdout = '',
      stderr = '';

    command.stdout.on('data', function (data) {
      stdout += data;
    });
    
    command.stderr.on('data', function (data) {
      stderr += data;
    });
    
    command.on('close', function (code) {
      if (code == 0) {
        res.redirect(settings.publish_url);
      } else {
        console.log('PublishingController.publish(): child process exited with code ' + code);
        res.status(500).send('Something went wrong while publishing...');
      }
    });
};


exports.publishedAll = function(req, res) {
  var published = {},
      Entity = new DB('Entity'),
      entities = Entity.findAll();
  
  entities.forEach(function(entity) {
    var db = new DB(entity._slug),
        items = db.findAll();
    
    published[entity.collection_slug] = resolve_references(items);
  });
  
  res.render('json/json.ejs', { layout: false, json: beautify(JSON.stringify(published)) }); 
};


exports.publishedCollection = function(req, res) {
  var Collection = new DB(req.params.collection_slug),
      collection_items = Collection.findAll(),
      published_items = resolve_references(collection_items);

  res.render('json/json.ejs', { layout: false, json: beautify(JSON.stringify(published_items)) }); 
};
