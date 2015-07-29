SidebarController = {
  init: function() {
    H.getJSON('/json/entities', function(entities) {
      new EJS({element: 'tmpl-sidebar'}).update('sidebar', {entities: entities});
    });
  }
};