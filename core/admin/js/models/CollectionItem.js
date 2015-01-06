var CollectionItem = function(entity_json, data_json) {
  var self = this;
  data_json = data_json || {};
  
  this._id = data_json._id || undefined;
  this._slug = data_json._slug || undefined;
  this._collection = entity_json.title;
  this._collection_id = entity_json._id;
  this._collection_slug = entity_json._slug;
  this.fields = [];

  this.entity_json = entity_json;

  this.$el = this.createEl();

  entity_json.fields.forEach(function(field) {
    self.addField(field, data_json);        
  });

  this.bind();
};


CollectionItem.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-collection-item'}).render({
      title: this.entity_json.title,
    });
    return $(html);
  },
  
  
  bind: function() {
    var self = this;
    
    this.$el.find('button[type="submit"]').click(function() {
      if (self._id) {
        H.postJSON('/json/collection/' + self._collection_slug + '/' + self._id, self.toJSON(), function() {
          window.history.back();      
        });
      } else {
        H.postJSON('/json/collection/' + self._collection_slug, self.toJSON(), function() {
          window.history.back();      
        });
      }
    });
  },
  
  
  addField: function(entity_json, data_json) {
    switch (entity_json.type) {
      case 'textfield':
        this.addTextField(entity_json, data_json);
        break;
      case 'textarea':
        this.addTextArea(entity_json, data_json);
        break;
      case 'wysiwyg':
        this.addWysiwyg(entity_json, data_json);
        break;
      case 'image':
        this.addImage(entity_json, data_json);
        break;
      case 'relationship':
        this.addRelationship(entity_json, data_json);
        break;
      default:
        console.log('CollectionItem.addField(): Dont know what to do with:', entity_json, data_json);
        break;
    }
  },
  
  addTextField: function(entity_json, data_json) {
    var self = this,
        textfield = new TextField(entity_json, data_json);
        
    this.fields.push(textfield);
    this.$el.find('.fields').append(textfield.$el);
  },


  addTextArea: function(entity_json, data_json) {
    var self = this,
        textarea = new TextArea(entity_json, data_json);
        
    this.fields.push(textarea);
    this.$el.find('.fields').append(textarea.$el);
  },


  addWysiwyg: function(entity_json, data_json) {
    var self = this,
        wysiwyg = new Wysiwyg(entity_json, data_json);
        
    this.fields.push(wysiwyg);
    this.$el.find('.fields').append(wysiwyg.$el);
  },


  addImage: function(entity_json, data_json) {
    var self = this,
        img = new ImageObject(entity_json, data_json);

    this.fields.push(img);
    this.$el.find('.fields').append(img.$el);
  },


  addRelationship: function(entity_json, data_json) {
    var self = this,
        relationship = new Relationship(entity_json, data_json);

    this.fields.push(relationship);
    this.$el.find('.fields').append(relationship.$el);
  },


  
  toJSON: function() {
    var json = {};

    if (this._id) {
      json._id = this._id;
    }

    if (this._slug) {
      json._slug = this._slug;
    }
    
    this.fields.forEach(function(field) {
      var field_json = field.toJSON(),
          key = H.slug(field_json.name);
          
      json[key] = field_json.value;
    });

    return json;
  }
}