var SeparatorStructure = function(json) {
  this.type = 'separator';
  json = json || {};
  
  this.title = json.title || '';
  this.onRemoveCallback = undefined;

  this.$el = this.createEl();
  this.bind();
};


SeparatorStructure.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-separator-structure'}).render({
      title: this.title,
    });
    return $(html);
  },


  bind: function() {
    var self = this;

    this.$el.find('input[name="title"]').keyup(function() {
      self.title = $(this).val();
    });
    
    this.$el.find('*[data-purpose="remove"]').click(function() {
      if (self.onRemoveCallback) { self.onRemoveCallback(); }
    });
  },
  
  
  toJSON: function() {
    return {
      type: this.type,
      title: this.title,
    };
  },
  
  
  onRemove: function(callback) {
    this.onRemoveCallback = callback;
  }
};
