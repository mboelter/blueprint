var express = require('express'),
    partials = require('express-partials'),
    bodyParser = require('body-parser'), 
    app = express(),
    EntityAdminController = require('./controller/EntityAdminController'),
    CollectionAdminController = require('./controller/CollectionAdminController'),
    ImageAdminController = require('./controller/ImageAdminController'),
    busboy = require('connect-busboy'),
    THEME = 'ddls';

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(busboy()); 
app.use(partials());
app.use(express.static(__dirname + '/public'));

app.get('/json/entities', EntityAdminController.json_all);
app.get('/json/entity/:id', EntityAdminController.json_one_by_id);
app.get('/json/entity/:id/delete', EntityAdminController.json_delete_by_id);
app.post('/json/entity/:id', EntityAdminController.json_update);
app.post('/json/entity', EntityAdminController.json_create);

app.get('/json/collection/:collection_id', CollectionAdminController.json_all);
app.get('/json/collection/:collection_id/:collection_item_id', CollectionAdminController.json_one_by_id);
app.get('/json/collection/:collection_id/delete/:collection_item_id', CollectionAdminController.json_delete_by_id);
app.post('/json/collection/:collection_id/:collection_item_id', CollectionAdminController.json_update);
app.post('/json/collection/:collection_id', CollectionAdminController.json_create);

app.post('/images/upload', ImageAdminController.create);
app.get('/json/images', ImageAdminController.json_all);
app.get('/json/image/:image_id', ImageAdminController.json_one_by_id);
app.get('/json/image/:image_id/delete', ImageAdminController.json_delete_by_id);

app.listen(9000);
