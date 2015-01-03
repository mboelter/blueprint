JsonApiController = {
  list: function() {
    $.getJSON('/json/entities', function(entities) {
      entities.forEach(function(entity) {
        var endpointHtml = new EJS({element: 'tmpl-json-endpoint-list-item'}).render({entity: entity});
        $('#json_api_endpoints').append($(endpointHtml));
      });
      ;
    });
  }
};