/* global H */
/* global $ */
/* global EJS */

var ImageStructure = function(json) {
  this.type = 'image';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.hint = json.hint || '';
  this.max_images = json.max_images || '';
  this.onRemoveCallback = undefined;

  this.$el = this.createEl();
  this.bind();
};


ImageStructure.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-image-structure'}).render({
      title: this.title,
      name: this.name,
      hint: this.hint,
      max_images: this.max_images,
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

    this.$el.find('input[name="max-images"]').keyup(function() {
      self.max_images = $(this).val();
    });
    
    this.$el.find('*[data-purpose="remove"]').click(function() {
      if (self.onRemoveCallback) { self.onRemoveCallback(); }
    });
  },
  
  
  toJSON: function() {
    return {
      type: this.type,
      title: this.title,
      name: this.name,
      hint: this.hint,
      max_images: this.max_images,
    };
  },
  
  
  onRemove: function(callback) {
    this.onRemoveCallback = callback;
  }
};
