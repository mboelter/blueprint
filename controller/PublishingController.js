var DB = require('../db.js'),
    beautify = require('js-beautify').js_beautify,
    fs = require('fs');

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
          var db = new DB(item[key]._collection_slug);
              resolved_ref = db.findById(item[key]._item_id);
          
          return resolved_ref;
        }
      }
      
      return item;
    });
    
    return items;
  };
  
  
  entities.forEach(function(entity) {
    var db = new DB(entity._slug),
        items = db.findAll();
    
    
    published[entity.collection_slug] = resolve_references(items);
  });
  
  res.render('json/json.ejs', { layout: false, json: beautify(JSON.stringify(published)) }); 
};
