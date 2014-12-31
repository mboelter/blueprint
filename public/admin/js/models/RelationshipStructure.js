var RelationshipStructure = function(json) {
  var self = this;
  
  this.type = 'relationship';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';  
  this.hint = json.hint || '';
  this.collection_slug = json.collection_slug || undefined;
  
  this.onRemoveCallback = undefined;

  this.$el = this.createEl();

  $.getJSON('/json/entities', function(entities) {
    entities.forEach(function(entity) {
      var $option = $('<option value="' + entity._slug + '">' + entity.title + '</option>');

      if (entity._slug == self.collection_slug) {
        $option.attr('selected', '');
      }

      self.$el.find('select[name="entity"]').append($option);
    });
  });

  this.bind();
};


RelationshipStructure.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-relationship-structure'}).render({
      title: this.title,
      name: this.name,
      hint: this.hint,
    });
    return $(html);
  },


  bind: function() {
    var self = this;
    
    this.$el.find('input[name="title"]').keyup(function() {
      self.title = $(this).val();
    });

    if (self.title == '') {
      this.$el.find('input[name="title"]').keyup(function() {
        self.name = H.slug($(this).val());
        self.$el.find('input[name="name"]').val(self.name);
      });
    }

    this.$el.find('input[name="name"]').keyup(function() {
      self.name = $(this).val();
    });
    
    this.$el.find('input[name="hint"]').keyup(function() {
      self.hint = $(this).val();
    });

    this.$el.find('*[data-purpose="remove"]').click(function() {
      if (self.onRemoveCallback) { self.onRemoveCallback(); }
    });

    this.$el.find('select[name="entity"]').change(function() {
      self.collection_slug = $(this).val();
      console.log('xxxx', $(this).val());
    });
  },
  
  
  toJSON: function() {
    return {
      type: this.type,
      title: this.title,
      name: this.name,
      hint: this.hint,
      collection_slug: this.collection_slug,
    };
  },

  onRemove: function(callback) {
    this.onRemoveCallback = callback;
  }

};
