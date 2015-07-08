var Separator = function(json, data_json) {
  this.type = 'separator';
  json = json || {};
  
  this.title = json.title || '';
  
  this.$el = this.createEl();
};


Separator.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-separator'}).render({
      title: this.title,
    });

    return $(html);
  },

  toJSON: function() {
    return {
      name: 'separator',
      value: this.title,
    };
  },

};

