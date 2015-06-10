/* global __dirname */

var DB = require('../db.js'),
    fs = require('fs'),
    Image = new DB('Image'),
    gm = require('gm'),
    helper = require('../helper.js'),
    path = require('path'),
    pathPrefix = path.join(__dirname, '/../bp-content/images'); // NEVER have a trailing slash!

exports.create = function(req, res) {
  var fstream;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    if (!fs.existsSync(pathPrefix)) {
      fs.mkdirSync(pathPrefix);
    }

    if (!fs.existsSync(pathPrefix + '/original')) {
      fs.mkdirSync(pathPrefix + '/original');
    }

    var filepath = pathPrefix + '/original/' + filename;
    
    // dont overwrite existing files, append _ to filename, but before the extension
    // filename.jpg will become filename_.jpg
    while(fs.existsSync(path)) {
      var arr = filename.split('.');
      arr[arr.length - 2] = arr[arr.length - 2] + '_';
      filename = arr.join('.');
      filepath = pathPrefix + '/original/' + filename;
    }

    var settings = JSON.parse(fs.readFileSync(path.join(__dirname, '../bp-settings.json'))),
        json = {
          _slug: helper.slug(filename),
          title: filename,
          filename: filename,
          uri: 'images/original/' + filename,
          thumbnails: {}
        };
    
    
    settings.thumbnailsizes.forEach(function(thumbnailConfig) {
      var slug = slugForThumbnailConfig(thumbnailConfig);
      
      json.thumbnails[slug] = {
        uri: 'images/thumbnails/' + slug + '/' + filename,
        width: thumbnailConfig.width,
        height: thumbnailConfig.height,
        mode: thumbnailConfig.mode
      }
    });    
    
    var image = Image.save(json);
    
    fstream = fs.createWriteStream(filepath);
    file.pipe(fstream);
    
    fstream.on('close', function () {
      createThumbnails(filename, settings, function() {
        res.json(image);
      });
    });
  });
};


exports.json_all = function(req, res) {
  var images = Image.findAll();
  res.json(images);
};


exports.json_one_by_id = function(req, res) {
  var image = Image.findById(req.params.image_id);
  if (image) {
    res.json(image);
  } else {
    res.json(false);
  }
};

exports.json_delete_by_id = function(req, res) {
  var img = Image.findById(req.params.image_id),
      filepath = __dirname + '/../bp-content/' + img.uri;
      
  fs.unlinkSync(filepath);
  Image.delete(req.params.image_id);
  res.json({});
};


exports.json_update_by_id = function(req, res) {
  Image.updateById(req.params.image_id, req.body);
  var image = Image.findById(req.params.image_id);
  res.json(image);
};


var createThumbnails = function(filename, settings, callback) {
  var counter = 0;

  settings.thumbnailsizes = settings.thumbnailsizes || [];
  
  if (settings.thumbnailsizes.length == 0) {
    callback();
    return;
  }

  settings.thumbnailsizes.forEach(function(thumbnailConfig) {
    createThumbnail(filename, thumbnailConfig, function() {
      counter = counter + 1;
      
      if (counter == settings.thumbnailsizes.length) {
        callback();
      }
    });    
  });
};


var createThumbnail = function(filename, thumbnailConfig, callback) {
  var slug = slugForThumbnailConfig(thumbnailConfig),
      input = pathPrefix + '/original/' + filename,
      output = pathPrefix + '/thumbnails/' + slug + '/' + filename;;

  if (!fs.existsSync(pathPrefix + '/thumbnails/')) {
    fs.mkdirSync(pathPrefix + '/thumbnails/')
  }
  
  if (!fs.existsSync(pathPrefix + '/thumbnails/' + slug)) {
    fs.mkdirSync(pathPrefix + '/thumbnails/' + slug)
  }

  switch(thumbnailConfig.mode) {
    case 'max':
      gm(input).resize(thumbnailConfig.width, thumbnailConfig.height, '>').write(output, function() {
        callback();
      });
      break;
      
    case 'min':
      gm(input).resize(thumbnailConfig.width, thumbnailConfig.height, '^').write(output, function() {
        callback();
      });
      break;
  }
};


var slugForThumbnailConfig = function(thumbnailConfig) {
  return thumbnailConfig.width + 'x' + thumbnailConfig.height + '_' + thumbnailConfig.mode;
};