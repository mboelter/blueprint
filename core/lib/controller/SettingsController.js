/* global __dirname */

var path = require('path'),
    fs = require('fs');

exports.get = function(req, res) {
  var settings = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../bp-settings.json')));
  res.json(settings);
};


exports.post = function(req, res) {
  var settingsStr = req.body.settings;

  fs.writeFileSync(path.join(__dirname, '../../../bp-settings.json'), settingsStr);
  res.json(JSON.parse(settingsStr));
};
