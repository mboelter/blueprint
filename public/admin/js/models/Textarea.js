var TextArea = function(json, data_json) {
  this.type = 'textarea';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.placeholder = json.placeholder || '';
  this.hint = json.hint || '';
  this.value = data_json[json.name] || '';
  
  this.$el = this.createEl();
  this.bind();
};


TextArea.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-textarea'}).render({
      title: this.title,
      placeholder: this.placeholder,
      hint: this.hint,
      value: this.value,
    });

    return $(html);
  },


  bind: function() {
    var self = this;
    
    this.$el.find('textarea').keyup(function() {
      self.value = $(this).val();
    });
  },
  
  
  toJSON: function() {
    return {
      name: this.name,
      value: this.value,
    };
  },

};

