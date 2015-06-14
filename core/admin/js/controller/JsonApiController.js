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
        $url = $el.find('*[data-purpose="url"]');
        
    $el.find('select').bind('change', function() {
      var $result = $el.find('*[data-purpose="result"]'),
          collectionSlug = $el.find('select[data-purpose="collection"]').val(),
          collectionAs = $el.find('select[data-purpose="collection-as"]').val(),
          inlineRelationships = $el.find('select[data-purpose="inline-relationships"]').val(),
          url = '/json/published/' + collectionSlug,
          paramsStr = '';
      
      if (collectionAs != 'array') {
        paramsStr += 'collectionsAs=' + collectionAs;
      }
      
      if (inlineRelationships != 'yes') {
        paramsStr += '&inlineRelationships=' + inlineRelationships;        
      }
      
      if (paramsStr.length > 0) {
        url = url + '?' + paramsStr;
      }
      
      $url.val(url);
      
      $.getJSON(url, function(json) {
        var result = JSON.stringify(json); 
        result = js_beautify(result);
        $result.val(result);       
      });
    
    });     
    
    // fill the text field on page load
    $el.find('select').first().trigger('change');
  },
};