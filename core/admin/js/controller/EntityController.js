/* global H */

EntityController = {
  list: function() {
    $.getJSON('/json/entities', function(entities) {
      new EJS({element: 'tmpl-entity-list-items'}).update('entity-list', {entities: entities});
      
      $('*[data-purpose="add-new"]').click(function() {
        window.location.href = '#/entity/new';
      });
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
  },
  
  
  changeOrder: function(slug) {
    var self = this;
    
    $.getJSON('/json/entity/' + slug, function(entity) {
      var fieldTitles = [];
      
      entity.fields.forEach(function(field, i) {
        fieldTitles.push(field.title + ' (' + i + ')');
      });

      $('#entity-change-order').val(fieldTitles.join('\n'));
      
      $('button[data-purpose="save-entity-change-order"]').click(function() {
        self.updateChangedOrder(slug, entity, $('#entity-change-order').val());
      });
    });
  },
  
  
  updateChangedOrder: function(slug, entity, newOrder) {
    var tmpFields = [];
    
    // copy array and avoid just a memory-reference
    entity.fields.forEach(function(field) {
      tmpFields.push(field);
    });    
    
    // clean up newline-madness
    var newOrderArr = newOrder.replace(/\r\n/g, '\n').split('\n');
    
    // filter out blank lines
    newOrderArr = newOrderArr.filter(function(o) {
      if (o.trim() == '') {
        return false;
      } else {
        return true;
      }
    });

    // assign new order to entity
    newOrderArr.forEach(function(order, i) {
      var arr = order.split(' '),
          numStr = arr[arr.length - 1],
          num = numStr.replace('(', '').replace(')', ''),
          idx = parseInt(num, 10);

      // safety check
      if (isNaN(idx)) {
        return;
      }
      
      entity.fields[i] = tmpFields[idx];
    });
    
    
    // save updated entity to server
    H.postJSON('/json/entity/' + slug, entity, function() {
      window.history.back();      
    });
  }

};
