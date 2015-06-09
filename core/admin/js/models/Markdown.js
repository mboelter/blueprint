var Markdown = function(json, data_json) {
  this.type = 'markdown';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.placeholder = json.placeholder || '';
  this.hint = json.hint || '';
  this.value = data_json[json.name] || '';
  
  this.$el = this.createEl();
  this.bind();
};


Markdown.prototype = {
  createEl: function() {
    var html = new EJS({element: 'tmpl-markdown'}).render({
      title: this.title,
      placeholder: this.placeholder,
      hint: this.hint,
      value: this.value,
    });

    return $(html);
  },


  bind: function() {
    var self = this;
    
    this.$el.find('textarea').bind('loadCodeMirror', function() {
      self._textAreaDomId = H.getDomId();
      
      $(this).attr('id', self._textAreaDomId);
      tinymce.init({
        oninit : 'setPlainText',
        content_css : 'css/tinymce.css',
        selector: '#' + self._textAreaDomId,
        menubar : false,
        plugins: 'link fullscreen paste code',
        toolbar: ['formatselect | bold italic underline strikethrough | bullist numlist blockquote | alignleft aligncenter alignright alignjustify | link | removeformat | code | fullscreen'],
      });
    });
  },
  
  
  toJSON: function() {
    tinymce.triggerSave();
    this.value = tinymce.get(this._textAreaDomId).getContent();

    return {
      name: this.name,
      value: this.value,
    };
  },

};

