EntityController = {
  list: function() {
    $.getJSON('/json/entities', function(entities) {
      new EJS({element: 'tmpl-entity-list-items'}).update('entity-list', {entities: entities});
    });
  },
  
  edit: function(slug) {
    $.getJSON('/json/entity/' + slug, function(entity) {
      var entity = new EntityStructure(entity);
      $('#entity').html(entity.$el);
    });
  },

  new: function() {
    var entity = new EntityStructure();
    $('#entity').html(entity.$el);
  }

};
