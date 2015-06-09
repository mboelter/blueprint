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
        self.addImage(image, {
          selected: true,
        });
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
  
  
  addImage: function(image_json, params) {
    params = params || {};
    
    var self = this,
        itemHtml = new EJS({element: 'tmpl-image-grid-item'}).render({
          image: image_json,
          params: {
            show_remove_link: false,
          }, 
        }),
        $itemHtml = $(itemHtml);
    
    
    $itemHtml.data('json', image_json);

    if (params.selected) {
      this._selectedItems.push(image_json);
      $itemHtml.addClass('selected');
    }

    $itemHtml.find('.edit').click(function() {
      console.log('edit in Image Picker');
      return false;
    });

  	// bind click on image -> selected state
    $itemHtml.click(function() {
      if ($(this).hasClass('selected')) {
        var id = $(this).data('json')._id;

        self._selectedItems = self._selectedItems.filter(function(item) {
          if (item._id == id) { return false; }
          return true;
        });        
        
        $(this).removeClass('selected');
      } else {
        self._selectedItems.push($(this).data('json'));
        $(this).addClass('selected');
      }
    });
    
    this.$el.find('.image-grid').prepend($itemHtml);
  },
  
  
  onSelected: function(callback) {
    this._onSelectedCallback = callback;
  }

};