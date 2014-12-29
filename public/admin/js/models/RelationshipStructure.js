var RelationshipStructure = function(json) {
  var self = this;
  
  this.type = 'relationship';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';  
  this.hint = json.hint || '';
  this.entity_id = json.entity_id || '';
  
  this.onRemoveCallback = undefined;

  this.$el = this.createEl();

  $.getJSON('/json/entities', function(entities) {
    entities.forEach(function(entity) {
      var $option = $('<option value="' + entity._id + '">' + entity.title + '</option>');

      if (entity._id == self.entity_id) {
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
      self.entity_id = $(this).val();
      console.log($(this).val());
    });
  },
  
  
  toJSON: function() {
    return {
      type: this.type,
      title: this.title,
      name: this.name,
      hint: this.hint,
      entity_id: this.entity_id,
    };
  },

  onRemove: function(callback) {
    this.onRemoveCallback = callback;
  }

};
