CollectionController = {
  list: function(collection_slug) {
    $.getJSON('/json/entity/' + collection_slug, function(entity) {
      $('*[data-purpose="collection-name"]').text(entity.collection_title);
      $('*[data-purpose="add-new"]').click(function() {
        window.location.href = '#/collection/' + entity._slug + '/new';
      });
    });

    $.getJSON('/json/collection/' + collection_slug, function(collection_items) {
      console.log(collection_items);
      new EJS({element: 'tmpl-collection-list-items'}).update('collection-item-list', {collection_items: collection_items, collection_slug: collection_slug});
    });

  },
  
  new: function(entity_slug) {
    $.getJSON('/json/entity/' + entity_slug, function(entity) {
      var item = new CollectionItem(entity);
      $('#collection-item-form').html(item.$el);
      item.$el.find('textarea.wysiwyg').trigger('loadTinyMCE');
    });
  },

  edit: function(entity_slug, collection_item_id) {
    console.log(entity_slug, collection_item_id);
    $.getJSON('/json/entity/' + entity_slug, function(entity) {
      $.getJSON('/json/collection/' + entity_slug + '/' + collection_item_id, function(collection_item) {
        var item = new CollectionItem(entity, collection_item);
        $('#collection-item-form').html(item.$el);
        item.$el.find('textarea.wysiwyg').trigger('loadTinyMCE');
      });
    });
  }
};