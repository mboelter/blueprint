Router = function() {
  var self = this;

  $(window).on('hashchange', function() {
    var hash = location.hash.replace(/^\#/, '');
    
    if (hash == '') {
      self.load('_dashboard.html');
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
      $.getJSON('/json/entity/' + slug + '/delete', function() {
        window.history.back();
      });
    } else if (/^\/entity\/.+/.test(hash)) {
      var slug = hash.split('/')[2];
      self.load('_entity.html', function() {
        EntityController.edit(slug);
      });
    } else if (/^\/collection\/.+\/edit\/.+$/.test(hash)) {
      var collection_id = hash.split('/')[2],
          collection_item_id = hash.split('/')[4];
      self.load('_collection_edit_item.html', function() {
        CollectionController.edit(collection_id, collection_item_id);
      });
    } else if (/^\/collection\/.+\/delete\/.+$/.test(hash)) {
      var collection_id = hash.split('/')[2],
          collection_item_id = hash.split('/')[4];
      $.getJSON('/json/collection/' + collection_id + '/delete/' + collection_item_id, function() {
        window.history.back();
      });
    } else if (/^\/collection\/.+\/new$/.test(hash)) {
      var entity_id = hash.split('/')[2];
      self.load('_collection_new_item.html', function() {
        CollectionController.new(entity_id);
      });
    } else if (/^\/collection\/.+/.test(hash)) {
      var id = hash.split('/')[2];
      self.load('_collection.html', function() {
        CollectionController.list(id);
      });
    } else if (hash == '/images') {
      self.load('_images.html', function() {
        ImageController.list();
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