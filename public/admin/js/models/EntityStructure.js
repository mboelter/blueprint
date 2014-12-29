var EntityStructure = function(json) {
  var self = this;
  json = json || {};
  
  this._id = json._id || undefined;
  this._slug = json._slug || undefined;
  this.title = json.title || '';
  this.fields = [];

  
  this.$el = this.createEl();
  
  
  // we are editing a current structure
  if (json.fields) {
    json.fields.forEach(function(fieldJson) {
      self.addField(fieldJson);
    });    
  }
  
  // each Entity is required to have a textfield called title, initialize here
  if (this.fields.length == 0) {
    this.addField({
      type: "textfield",
      title: "Title",
      name: H.slug('Title'),
      placeholder: "Title",
      hint: "",
    });
  }
  
  this.bind();
};


EntityStructure.prototype = {
  createEl: function() {
    var self = this;
    
    var html = new EJS({element: 'tmpl-entity'}).render({
      title: self.title,
    });

    return $(html);
  },
  
  
  bind: function() {
    var self = this;
    
    this.$el.find('input[name="entity-title"]').keyup(function() {
      self.title = $(this).val();
    });
    
    this.$el.find('*[data-purpose="add-textfield"]').click(function() {
      self.addTextField();
    });
    
    this.$el.find('*[data-purpose="add-textarea"]').click(function() {
      self.addTextArea();
    });

    this.$el.find('*[data-purpose="add-wysiwyg"]').click(function() {
      self.addWysiwyg();
    });

    this.$el.find('*[data-purpose="add-image"]').click(function() {
      self.addImage();
    });

    this.$el.find('*[data-purpose="add-relationship"]').click(function() {
      self.addRelationship();
    });


    this.$el.find('button[type="submit"]').click(function() {
      if (self._id) {
        console.log(self.toJSON());
        $.post('/json/entity/' + self._id, self.toJSON(), function() {
          window.history.back();      
        });
      } else {
        console.log(self.toJSON());
        $.post('/json/entity', self.toJSON(), function() {
          window.history.back();      
        });
      }
    });
    
  },
  
  addField: function(json) {
    switch (json.type) {
      case 'textfield':
        this.addTextField(json);
        break;
      case 'textarea':
        this.addTextArea(json);
        break;
      case 'wysiwyg':
        this.addWysiwyg(json);
        break;
      case 'image':
        this.addImage(json);
        break;
      case 'relationship':
        this.addRelationship(json);
        break;
      default:
        console.log('Entity.addField(): Dont know what to do with:', json);
        break;
    }
  },
  
  addTextField: function(json) {
    var self = this,
        textfield = new TextFieldStructure(json),
        idx = this.fields.length;
    
    textfield.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      textfield.$el.remove();
    });

    this.fields.push(textfield);
    this.$el.find('.fields').append(textfield.$el);
  },

  addTextArea: function(json) {
    var self = this,
        textarea = new TextAreaStructure(json),
        idx = this.fields.length;

    textarea.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      textarea.$el.remove();
    });

    this.fields.push(textarea);
    this.$el.find('.fields').append(textarea.$el);
  },

  addWysiwyg: function(json) {
    var self = this,
        wysiwyg = new WysiwygStructure(json),
        idx = this.fields.length;

    wysiwyg.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      wysiwyg.$el.remove();
    });

    this.fields.push(wysiwyg);
    this.$el.find('.fields').append(wysiwyg.$el);
  },

  addImage: function(json) {
    var self = this,
        img = new ImageStructure(json),
        idx = this.fields.length;

    img.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      img.$el.remove();
    });

    this.fields.push(img);
    this.$el.find('.fields').append(img.$el);
  },

  addRelationship: function(json) {
    var self = this,
        relationship = new RelationshipStructure(json),
        idx = this.fields.length;

    relationship.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      relationship.$el.remove();
    });

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

    json.title = this.title;
    json.fields = [];
    
    this.fields.forEach(function(field) {
      if (!field) { // field seems to be undefined, therefor it was removed in the past
        return; 
      }
      
      json.fields.push(field.toJSON());
    });
    
    return json;
  }
}