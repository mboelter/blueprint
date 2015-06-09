var ImageObject = function(json, data_json) {
  this.type = 'image';
  json = json || {};
  
  this.title = json.title || '';
  this.name = json.name || '';
  this.placeholder = json.placeholder || '';
  this.hint = json.hint || '';
  this.value = data_json[json.name] || [];
  
  this.$el = this.createEl();
  this.bind();
};


ImageObject.prototype = {
  createEl: function() {
    var self = this;
  
    var html = new EJS({element: 'tmpl-image-object'}).render({
      title: this.title,
      hint: this.hint,
      value: this.value,
    });

    this.value.forEach(function(image_ref) {
      var ref = image_ref._ref;
      
      $.getJSON('/json/image/' + ref._item_id, function(image) {
        self.addImageToImageGrid(image, ref._item_id);
      });
    });

    return $(html);
  },


  bind: function() {
    var self = this;
    
    this.$el.find('*[data-role="add-image"]').click(function() {
      var popup = new Popup(),
          imagePicker = new ImagePicker();

      popup.html(imagePicker.$el);
      popup.show();      

      imagePicker.onSelected(function(images) {
        images.forEach(function(image) {

          self.value.push({
            _ref: {
              _collection_slug: 'Image',
              _item_id: image._id,
            }
          });
          
          self.addImageToImageGrid(image);
        });
        popup.hide();
      });
    });
  },
  
  
  addImageToImageGrid: function(image, imageId) {
    var self = this,
        imageHtml = new EJS({element: 'tmpl-image-grid-item'}).render({
          image: image, 
          params: {
            show_remove_link: true,
          }, 
        }),
        $imageHtml = $(imageHtml);

    if (image) {
      $imageHtml.data('json', image);
    } else {
      // handle images that are "false", because they are still referenced, but are deleted from the Image Library.
      // this hack allows the reference still to be deleted.
      $imageHtml.data('json', {
        _id: imageId,
      });
    }
     
    // bind edit
    $imageHtml.find('.edit').click(function() {
      var $imageGridItem = $(this).parent('.image-grid-item'),
          imageId = $imageGridItem.data('json')._id;
      
      ImagePropertiesController.init(imageId);
      ImagePropertiesController.show();
      
      return false;
    });

     
    // bind remove   
    $imageHtml.find('.remove').click(function() {
      var $imageGridItem = $(this).parent('.image-grid-item');

      self.removeImageById($imageGridItem.data('json')._id);
      $imageGridItem.remove();
    });
    
    this.$el.find('.image-grid').append($imageHtml);
  },
  
  
  removeImageById: function(imageId) {
    this.value = this.value.filter(function(image) {
      if (image._ref._item_id == imageId) {
        return false;
      }

      return true;
    });
  },
  
  
  toJSON: function() {
    return {
      name: this.name,
      value: this.value,
    };
  },

};

