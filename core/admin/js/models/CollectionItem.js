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
    
    this.$el.find('button[data-purpose="save"]').click(function() {
      if (self._id) {
        // update
        H.postJSON('/json/collection/' + self._collection_slug + '/' + self._id, self.toJSON(), function() {
          var toast = new Toast('Saved.');
        });
      } else {
        // create
        H.postJSON('/json/collection/' + self._collection_slug, self.toJSON(), function(item) {
          // redirect to edit              
          window.location.href = '#/collection/' + self._collection_slug + '/edit/' + item._id;
          
          setTimeout(function() {
            var toast = new Toast('Saved.');
          }, 200);
        });
      }
    });


    this.$el.find('button[data-purpose="save-and-publish"]').click(function() {
      if (self._id) {
        H.postJSON('/json/collection/' + self._collection_slug + '/' + self._id, self.toJSON(), function() {
          $.get('publish', function() {
            var toast = new Toast('Saved &amp; Published.');
          });
        });
      } else {
        H.postJSON('/json/collection/' + self._collection_slug, self.toJSON(), function() {
          $.get('publish', function() {
            var toast = new Toast('Saved &amp; Published.');
          });
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
      case 'markdown':
        this.addMarkdown(entity_json, data_json);
        break;
      case 'image':
        this.addImage(entity_json, data_json);
        break;
      case 'relationship':
        this.addRelationship(entity_json, data_json);
        break;
      case 'separator':
        this.addSeparator(entity_json, data_json);
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


  addMarkdown: function(entity_json, data_json) {
    var self = this,
        markdown = new Markdown(entity_json, data_json);
        
    this.fields.push(markdown);
    this.$el.find('.fields').append(markdown.$el);
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


  addSeparator: function(entity_json, data_json) {
    var self = this,
        separator = new Separator(entity_json, data_json);

    this.fields.push(separator);
    this.$el.find('.fields').append(separator.$el);
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