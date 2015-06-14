/* global js_beautify */
/* global EJS */
/* global $ */
/* global JsonApiController */

JsonApiController = {
  list: function() {
    $.getJSON('/json/entities', function(entities) {
      entities.forEach(function(entity) {
        var endpointHtml = new EJS({element: 'tmpl-json-endpoint-list-item'}).render({entity: entity}),
            optionHtml = '<option value="' + entity._slug + '">' + entity.title + '</option>';
            
        $('#json_api_endpoints').append($(endpointHtml));
        $('#admin-json-api-explorer').find('select[data-purpose="collection"]').append(optionHtml);
      });
      ;
    });
  },
  
  explorer: function() {
    var $el = $('#admin-json-api-explorer'),
        $btnRun = $el.find('*[data-purpose="run"]'),
        $url = $el.find('*[data-purpose="url"]');
        
    $el.find('select').bind('change', function() {
      var $result = $el.find('*[data-purpose="result"]'),
          collectionSlug = $el.find('select[data-purpose="collection"]').val(),
          url = '/json/published/' + collectionSlug;
      
      $url.val(url);
      $.getJSON(url, function(json) {
        var result = JSON.stringify(json); 
        result = js_beautify(result);
        $result.val(result);       
      });
    
    });     
    
    // fill the text field on page load
    $el.find('select').trigger('change');
  },
};