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
    items = items.map(function(item) {
      return resolve_references(item, depth);
    });
    
    // Sanitize:
    // remove references that point to an item that doesnt exist anymore.
    // they would look like null orr undefined as an element in the array.
    items = items.filter(function(item) {
      if (item) { return true; }

      return false;
    });
    
    return items;
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
        console.log('stdout:');
        console.log(stdout);
        console.log('stderr:');
        console.log(stderr);
       res.status(500).send('Something went wrong while publishing...<br><pre>' + stdout + '</pre><br><pre>' + stderr + '</pre>');
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


exports.downloadAsZip = function(req, res) {
  var spawn = require('child_process').spawn,
      settings = JSON.parse(fs.readFileSync('./bp-settings.json')),
      command = spawn('sh', ['-c', settings.publish_package_hook]),
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
        res.redirect(settings.publish_package_url);
      } else {
        console.log('PublishingController.downloadAsZip(): child process exited with code ' + code);
        console.log('stdout:');
        console.log(stdout);
        console.log('stderr:');
        console.log(stderr);

        res.status(500).send('Something went wrong while zipping...<br><pre>' + stdout + '</pre><br><pre>' + stderr + '</pre>');
      }
    });
  
};
