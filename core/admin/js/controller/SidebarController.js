SidebarController = {
  init: function() {
    $.getJSON('/json/entities', function(entities) {
      new EJS({element: 'tmpl-sidebar'}).update('sidebar', {entities: entities});
    });
  }
};