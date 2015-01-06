var express = require('express'),
    partials = require('express-partials'),
    bodyParser = require('body-parser'), 
    compression = require('compression'),
    app = express(),
    EntityAdminController = require('./controller/EntityAdminController'),
    CollectionAdminController = require('./controller/CollectionAdminController'),
    ImageAdminController = require('./controller/ImageAdminController'),
    PublishingController = require('./controller/PublishingController'),
    busboy = require('connect-busboy'),
    helper = require('./helper'),
    fs = require('fs');
  

// check if bp-settings.json exists
// if not, copy over from bp-settings.json.sample

if (!fs.existsSync('./bp-settings.json')) {
  var settings = fs.readFileSync('./bp-settings.json.sample');
  fs.writeFileSync('./bp-settings.json', settings);
};

try {
  var settings = JSON.parse(fs.readFileSync('./bp-settings.json'));
} catch(e) {
  console.log('Error parsing bp-settings.json.');
  return;
}

app.use(compression());
app.use(helper.basicAuth('frog', 'friedolin'));
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing json
app.use(busboy()); 
app.use(partials());

app.use('/admin/images', express.static(__dirname + "/bp-content/images"));
app.use(express.static(__dirname + '/public'));




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

app.post('/images/upload', ImageAdminController.create);
app.get('/json/images', ImageAdminController.json_all);
app.get('/json/image/:image_id', ImageAdminController.json_one_by_id);
app.get('/json/image/:image_id/delete', ImageAdminController.json_delete_by_id);

app.get('/admin/publish', PublishingController.publish);
app.get('/admin/publish/download', PublishingController.downloadAsZip);
app.get('/json/published/all', PublishingController.publishedAll);
app.get('/json/published/:collection_slug', PublishingController.publishedCollection);


app.listen(settings.port);
