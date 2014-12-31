var Relationship = function(json, data_json) {
  this.type = 'relationship';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.hint = json.hint || '';
  this.collection_slug = json.collection_slug || undefined;
  this.value = data_json[json.name] || [];
  
  this.createEl();
  this.bind();
};


Relationship.prototype = {
  createEl: function() {
    var self = this;
  
    var html = new EJS({element: 'tmpl-relationship'}).render({
      title: this.title,
      hint: this.hint,
      value: this.value,
    });

    this.$el = $(html);
    
    console.log('need to fetch items for: ', this.collection_slug);

    $.getJSON('/json/collection/' + this.collection_slug, function(collection) {
      collection.forEach(function(collection_item) {
        var $li = $('<li>' + collection_item.title + '</li>');
        $li.data('collection_item_id', collection_item._id);
        
        if (self.isSelected(collection_item)) {
          self.$el.find('ul[data-purpose="selected-list"]').append($li);
        } else {
          self.$el.find('ul[data-purpose="candidate-list"]').append($li);
        }
      });
    });

  },


  bind: function() {
    var self = this;

    this.$el.find('ul[data-purpose="candidate-list"]').click(function(e) {
      var $li = $(e.target),
          collection_item_id = $li.data('collection_item_id');
      
      self._addReference(collection_item_id);
      $li.appendTo('ul[data-purpose="selected-list"]');
    });

    this.$el.find('ul[data-purpose="selected-list"]').click(function(e) {
      var $li = $(e.target),
          collection_item_id = $li.data('collection_item_id');


      self._removeReference(collection_item_id);
      $li.appendTo('ul[data-purpose="candidate-list"]');
    });
  },
  
  isSelected: function(collection_item) {
    var selectedList = [],
        candidateList = [],
        isSelected = false;
        
    this.value.forEach(function(ref) {
      if (ref._ref._item_id == collection_item._id) {
        isSelected = true;
      }
    });
    
    return isSelected; 
  },
  
  
  _addReference: function(collection_item_id) {
    this.value.push({
      _ref: {
        _collection_slug: this.collection_slug,
        _item_id: collection_item_id,
      }
    });
  },
  
  
  _removeReference: function(collection_item_id) {
    this.value = this.value.filter(function(ref) {
      if (collection_item_id == ref._ref._item_id) {
        return false;
      }
      
      return true;
    });
  },

  
  
  toJSON: function() {
    return {
      name: this.name,
      value: this.value,
    };
  },

};






