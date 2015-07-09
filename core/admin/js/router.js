/* global SettingsController */
/* global SidebarController */
/* global JsonApiController */
/* global ImageController */
/* global CollectionController */
/* global Router */
/* global EntityController */
/* global EJS */
/* global $ */

Router = function() {
  var self = this;

  $(window).on('hashchange', function() {
    var hash = location.hash.replace(/^\#/, '');
    
    if (hash == '') {
      self.load('_dashboard.html', function() {
        $.getJSON('/json/entities', function(entities) {
          new EJS({element: 'tmpl-dashboard-entity-list'}).update('dashboard-collections', {entities: entities});
        });        
      });
    } else if (hash == '/entities') {
      self.load('_entities.html', function() {
        EntityController.list();
      });
    } else if (hash == '/entity/new') {
      self.load('_entity.html', function() {
        EntityController.new();
      });
    } else if (/^\/entity\/.+\/delete$/.test(hash)) {
      var slug = hash.split('/')[2];
      if (confirm('Are you sure to delete "' + slug + '" and ALL items in "' + slug + '"?')) {
        $.getJSON('/json/entity/' + slug + '/delete', function() {
          window.history.back();
        });
      } else {
        window.history.back();
      }
    } else if (/^\/entity\/.+\/changeOrder$/.test(hash)) {
      var slug = hash.split('/')[2];
      self.load('_entity_change_order.html', function() {
        EntityController.changeOrder(slug);
      });
    } else if (/^\/entity\/.+/.test(hash)) {
      var slug = hash.split('/')[2];
      self.load('_entity.html', function() {
        EntityController.edit(slug);
      });
    } else if (/^\/collection\/.+\/edit\/.+$/.test(hash)) {
      var collection_slug = hash.split('/')[2],
          collection_item_id = hash.split('/')[4];
          
      self.load('_collection_edit_item.html', function() {
        CollectionController.edit(collection_slug, collection_item_id);
      });
    } else if (/^\/collection\/.+\/delete\/.+$/.test(hash)) {
      var collection_slug = hash.split('/')[2],
          collection_item_id = hash.split('/')[4];
          
      if (confirm('Are you sure?')) {
        $.getJSON('/json/collection/' + collection_slug + '/delete/' + collection_item_id, function() {
          window.history.back();
        });
      } else {
        window.history.back();
      }
    } else if (/^\/collection\/.+\/new$/.test(hash)) {
      var collection_slug = hash.split('/')[2];
      self.load('_collection_new_item.html', function() {
        CollectionController.new(collection_slug);
      });
    } else if (/^\/collection\/.+/.test(hash)) {
      var collection_slug = hash.split('/')[2];
      self.load('_collection.html', function() {
        CollectionController.list(collection_slug);
      });
    } else if (hash == '/images') {
      self.load('_images.html', function() {
        ImageController.list();
      });
    } else if (hash == '/json_api') {
      self.load('_json_api.html', function() {
        JsonApiController.list();
        JsonApiController.explorer();
      });
    } else if (hash == '/settings') {
      self.load('_settings.html', function() {
        SettingsController.init();
      });
    } else {
      console.log('Router: Not found: ', hash);
      self.load('_not_found.html');
    };
  });
  
  $(window).trigger('hashchange');
};


Router.prototype = {
  load: function(url, callback) {
    $('.container').empty();
    
    $.get(url, function(html) {
      var $html = $('<div>' + html + '</div>');
      
      $('.container').html(html);
      
      if (callback) { 
        callback($html); 
      }
    });

    this.load_sidebar(function() {
      SidebarController.init();
    });
  },
  
  load_sidebar: function(callback) {
    if (callback) { callback(); }
  }
};