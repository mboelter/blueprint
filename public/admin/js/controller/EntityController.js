EntityController = {
  list: function() {
    $.getJSON('/json/entities', function(entities) {
      new EJS({element: 'tmpl-entity-list-items'}).update('entity-list', {entities: entities});
    });
  },
  
  edit: function(id) {
    $.getJSON('/json/entity/' + id, function(entity) {
      var entity = new EntityStructure(entity);
      $('#entity').html(entity.$el);
    });
  },

  new: function(id) {
    var entity = new EntityStructure();
    $('#entity').html(entity.$el);
  }

};
