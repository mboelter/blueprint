var Relationship = function(json, data_json) {
  this.type = 'relationship';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.hint = json.hint || '';
  this.collection_slug = json.collection_slug || undefined;
  this.value = data_json[json.name] || [];
  
  this.createEl();
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

    H.getJSON('/json/collection/' + this.collection_slug, function(collection) {
      collection = H.sortArrayByObjectProperty(collection, 'title');
      
      // map to a obj that select2 can consume
      collection = collection.map(function(item) {
        var result = {};
        
        result.id = item._id;
        result.text = item.title;
        
        if (self.isSelected(item)) {
          result.selected = 'selected';        
        }
        
        return result;
      });
      
      // bind/populate select2
      self.$el.find('.select2-array').select2({
        data: collection
      });
    }); // H.getJSON()
  },


  
  isSelected: function(collection_item) {
    var isSelected = false;
        
    this.value.forEach(function(ref) {
      if (ref._ref._item_id == collection_item._id) {
        isSelected = true;
      }
    });
    
    return isSelected; 
  },
  
    
  toJSON: function() {
    var self = this;
    
    self.value = [];  
    
    this.$el.find('.select2-array').val().forEach(function(id) {
      self.value.push({
        _ref: {
          _collection_slug: self.collection_slug,
          _item_id: id,
        }
      });
    });
        
    return {
      name: this.name,
      value: this.value,
    };
  },

};






