var EntityStructure = function(json) {
  var self = this;
  json = json || {};
  
  this._id = json._id || undefined;
  this._slug = json._slug || undefined;
  this.title = json.title || '';
  this.collectionTitle = json.collection_title || '';
  this._collectionSlug = json.collection_slig || '';
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
      placeholder: "",
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
      collectionTitle: self.collectionTitle,
      slug: self._slug,
    });

    return $(html);
  },
  
  
  bind: function() {
    var self = this;
    
    this.$el.find('input[name="entity-title"]').keyup(function() {
      self.title = $(this).val();
    });

    if (self.title == '') {
      this.$el.find('input[name="entity-title"]').keyup(function() {
        self.collectionTitle = owl.pluralize($(this).val());
        self.$el.find('input[name="collection-title"]').val(self.collectionTitle);
      });
    }

    this.$el.find('input[name="collection-title"]').keyup(function() {
      self.collectionTitle = $(this).val();
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

    this.$el.find('*[data-purpose="add-markdown"]').click(function() {
      self.addMarkdown();
    });

    this.$el.find('*[data-purpose="add-image"]').click(function() {
      self.addImage();
    });

    this.$el.find('*[data-purpose="add-relationship"]').click(function() {
      self.addRelationship();
    });

    this.$el.find('*[data-purpose="add-separator"]').click(function() {
      self.addSeparator();
    });

    this.$el.find('button[type="submit"]').click(function() {
      if (self._id) {
        console.log(self.toJSON());
        H.postJSON('/json/entity/' + self._slug, self.toJSON(), function() {
          window.history.back();      
        });
      } else {
        console.log(self.toJSON());
        H.postJSON('/json/entity', self.toJSON(), function() {
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
      case 'markdown':
        this.addMarkdown(json);
        break;
      case 'image':
        this.addImage(json);
        break;
      case 'relationship':
        this.addRelationship(json);
        break;
      case 'separator':
        this.addSeparator(json);
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

  addMarkdown: function(json) {
    var self = this,
        markdown = new MarkdownStructure(json),
        idx = this.fields.length;

    markdown.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      markdown.$el.remove();
    });

    this.fields.push(markdown);
    this.$el.find('.fields').append(markdown.$el);
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


  addSeparator: function(json) {
    var self = this,
        separator = new SeparatorStructure(json),
        idx = this.fields.length;

    separator.onRemove(function() {
      self.fields[idx] = undefined; // mark field as removed
      separator.$el.remove();
    });

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


    json.title = this.title;
    json.collection_title = this.collectionTitle;
    json.collection_slug = H.slug(this.collectionTitle);
    json.fields = [];
    
    this.fields.forEach(function(field) {
      if (!field) { // field seems to be undefined, therefor it was removed in the past
        return; 
      }
      
      json.fields.push(field.toJSON());
    });
    
    return json;
  }
};