CollectionController = {
  list: function(id) {
    $.getJSON('/json/entity/' + id, function(entity) {
      $('*[data-purpose="collection-name"]').text(entity.collection_title);
      $('a[data-purpose="add-new"]').attr('href', '#/collection/' + entity._id + '/new');
    });

    $.getJSON('/json/collection/' + id, function(collection_items) {
      console.log(collection_items);
      new EJS({element: 'tmpl-collection-list-items'}).update('collection-item-list', {collection_items: collection_items, collection_id: id});
    });

  },
  
  new: function(entity_id) {
    $.getJSON('/json/entity/' + entity_id, function(entity) {
      var item = new CollectionItem(entity);
      $('#collection-item-form').html(item.$el);
      item.$el.find('textarea.wysiwyg').trigger('loadTinyMCE');
    });
  },

  edit: function(entity_id, collection_item_id) {
    console.log(entity_id, collection_item_id);
    $.getJSON('/json/entity/' + entity_id, function(entity) {
      $.getJSON('/json/collection/' + entity_id + '/' + collection_item_id, function(collection_item) {
        var item = new CollectionItem(entity, collection_item);
        $('#collection-item-form').html(item.$el);
        item.$el.find('textarea.wysiwyg').trigger('loadTinyMCE');
      });
    });
  }
};