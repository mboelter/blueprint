var DB = require('../db.js'),
    fs = require('fs'),
    Image = new DB('Image'),
    gm = require('gm'),
    helper = require('../helper.js'),
    pathPrefix = __dirname + '/../bp-content/images'; // NEVER have a trailing slash!

exports.create = function(req, res) {
  var fstream;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    if (!fs.existsSync(pathPrefix)) {
      fs.mkdirSync(pathPrefix)
    }

    if (!fs.existsSync(pathPrefix + '/original')) {
      fs.mkdirSync(pathPrefix + '/original')
    }

    var path = pathPrefix + '/original/' + filename;
    
    // dont overwrite existing files, append _ to filename, but before the extension
    // filename.jpg will become filename_.jpg
    while(fs.existsSync(path)) {
      var arr = filename.split('.');
      arr[arr.length - 2] = arr[arr.length - 2] + '_';
      filename = arr.join('.');
      path = pathPrefix + '/original/' + filename;
    }

    var settings = JSON.parse(fs.readFileSync('./bp-settings.json')),
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
    
    fstream = fs.createWriteStream(path);
    file.pipe(fstream);
    
    fstream.on('close', function () {
      createThumbnails(filename, settings, function() {
        res.render('json/json.ejs', { layout: false, json: JSON.stringify(image) }); 
      });
    });
  });
};


exports.json_all = function(req, res) {
  var images = Image.findAll();
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(images) }); 
};


exports.json_one_by_id = function(req, res) {
  var image = Image.findById(req.params.image_id);
  if (image) {
    res.render('json/json.ejs', { layout: false, json: JSON.stringify(image) }); 
  } else {
    res.render('json/json.ejs', { layout: false, json: JSON.stringify(false) }); 
  }
};

exports.json_delete_by_id = function(req, res) {
  var img = Image.findById(req.params.image_id),
      path = __dirname + '/../bp-content/' + img.uri;
      
  fs.unlinkSync(path);
  Image.delete(req.params.image_id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify({}) }); 
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