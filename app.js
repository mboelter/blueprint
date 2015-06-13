/* global __dirname */
var express = require('express'),
    bodyParser = require('body-parser'), 
    compression = require('compression'),
    app = express(),
    EntityAdminController = require('./core/lib/controller/EntityAdminController'),
    CollectionAdminController = require('./core/lib/controller/CollectionAdminController'),
    ImageAdminController = require('./core/lib/controller/ImageAdminController'),
    PublishingController = require('./core/lib/controller/PublishingController'),
    SettingsController = require('./core/lib/controller/SettingsController'),
    busboy = require('connect-busboy'),
    helper = require('./core/lib/helper'),
    path = require('path'),
    fs = require('fs');
  

// check if bp-settings.json exists
// if not, copy over from bp-settings.json.sample

if (!fs.existsSync(path.join(__dirname, './bp-settings.json'))) {
  console.log('No bp-settings.json file found, copying bp-settings.json.samle -> bp-settings.json');
  var settings = fs.readFileSync(path.join(__dirname, './bp-settings.json.sample'));
  fs.writeFileSync(path.join(__dirname, './bp-settings.json'), settings);
};

try {
  var settings = JSON.parse(fs.readFileSync(path.join(__dirname, './bp-settings.json')));
} catch(e) {
  console.log('Error parsing bp-settings.json.');
  return;
}

app.use(compression());

// http authentication for /admin
if (settings.httpauth_username && settings.httpauth_password) {
  app.use(helper.basicAuth(settings.httpauth_username, settings.httpauth_password));
}

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing json
app.use(busboy()); 


app.get('/admin/bp-settings.json', SettingsController.get);
app.post('/admin/bp-settings.json', SettingsController.post);

app.get('/json/entities', EntityAdminController.json_all);
app.get('/json/entity/:slug', EntityAdminController.json_one_by_id);
app.get('/json/entity/:slug/delete', EntityAdminController.json_delete_by_slug);
app.post('/json/entity/:slug', EntityAdminController.json_update_by_slug);
app.post('/json/entity', EntityAdminController.json_create);

app.get('/json/collection/:collection_slug', CollectionAdminController.json_all);
app.get('/json/collection/:collection_slug/:collection_item_id', CollectionAdminController.json_one_by_id);
app.get('/json/collection/:collection_slug/delete/:collection_item_id', CollectionAdminController.json_delete_by_id);
app.post('/json/collection/:collection_slug/:collection_item_id', CollectionAdminController.json_update);
app.post('/json/collection/:collection_slug', CollectionAdminController.json_create);

app.post('/admin/images/upload', ImageAdminController.create);
app.get('/json/images', ImageAdminController.json_all);
app.get('/json/image/:image_id', ImageAdminController.json_one_by_id);
app.get('/json/image/:image_id/delete', ImageAdminController.json_delete_by_id);
app.post('/json/image/:image_id/update', ImageAdminController.json_update_by_id);

app.get('/admin/publish', PublishingController.publish);
app.get('/admin/publish/download', PublishingController.downloadAsZip);
app.get('/json/published/all', PublishingController.publishedAll);
app.get('/json/published/:collection_slug', PublishingController.publishedCollection);

app.use('/admin/images', express.static(__dirname + '/bp-content/images'));
app.use('/admin', express.static(__dirname + '/core/admin'));
app.use('/', express.static(__dirname + '/public'));


console.log('Listening on port', settings.port);
app.listen(settings.port);
