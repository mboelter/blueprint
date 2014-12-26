var DB = require('../db.js'),
    fs = require('fs'),
    Image = new DB('Image');

exports.create = function(req, res) {
  var fstream;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    var path = __dirname + '/../public/images/' + filename;
    
    while(fs.existsSync(path)) {
      var arr = filename.split('.');
      arr[arr.length - 2] = arr[arr.length - 2] + '_';
      filename = arr.join('.');
      path = __dirname + '/../public/images/' + filename;
    }


    var image = Image.save({
      title: filename,
      uri: 'images/' + filename,
    });
    
    fstream = fs.createWriteStream(path);
    file.pipe(fstream);
    fstream.on('close', function () {
      res.render('json/json.ejs', { layout: false, json: JSON.stringify(image) }); 
    });
  });
};


exports.json_all = function(req, res) {
  var images = Image.findAll();
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(images) }); 
};


exports.json_one_by_id = function(req, res) {
  var image = Image.findById(req.params.image_id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify(image) }); 
};

exports.json_delete_by_id = function(req, res) {
  var img = Image.findById(req.params.image_id),
      path = __dirname + '/../public/' + img.uri;
  fs.unlinkSync(path);
  Image.delete(req.params.image_id);
  res.render('json/json.ejs', { layout: false, json: JSON.stringify({}) }); 
};
