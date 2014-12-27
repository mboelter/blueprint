ImagePicker = function() {
  this.$el = undefined;
  this._selectedItems = [];
  this._onSelectedCallback = undefined;
  this.createEl();
  this.bind();
};


ImagePicker.prototype = {
  createEl: function() {
    var self = this,
        html = new EJS({element: 'tmpl-image-picker'}).render({});
    
    this.$el = $(html);

    this.$el.find('form[data-purpose="image-upload-form"]').change(function() {
      var $this = $(this);
      var imageUpload = new ImageUploader($(this), function(image) {
        $this.find('input[type=file]').val('');
        self.addImage(image);
      });

      return false;
    });
  
    $.getJSON('/json/images', function(images) {
      images.forEach(function(image) {
        self.addImage(image);
      });
    });
  },
  
  
  bind: function() {
    var self = this;
    
    this.$el.find('button[data-purpose="select-images"]').click(function() {
      self._onSelectedCallback(self._selectedItems);
    });
  },
  
  
  addImage: function(image_json) {
    var self = this,
        itemHtml = new EJS({element: 'tmpl-image-grid-item'}).render({image: image_json}),
        $itemHtml = $(itemHtml);
    
    $itemHtml.data('json', image_json);
    $itemHtml.click(function() {
      $(this).addClass('selected');
      self._selectedItems.push($(this).data('json'));
    });
    
    this.$el.find('.image-grid').prepend($itemHtml);
  },
  
  
  onSelected: function(callback) {
    this._onSelectedCallback = callback;
  }

};