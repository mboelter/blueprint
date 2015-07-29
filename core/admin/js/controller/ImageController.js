/* global $ */
/* global ImageUploader */
/* global ImageController */
ImageController = {
  list: function() {
    var self = this;
    $('form[data-purpose="image-upload-form"]').change(function() {
      var $this = $(this);
      var imageUpload = new ImageUploader($(this), function(image) {
        $this.find('input[type=file]').val('');
        ImageController._addImage(image);
      });

      return false;
    });
    
    H.getJSON('/json/images', function(images) {
      images.forEach(function(image) {
        ImageController._addImage(image);
      });
    });
  },
  
  _addImage: function(image_json) {
    var self = this,
        imageHtml = new EJS({element: 'tmpl-image-grid-item'}).render({
          image: image_json,
          params: {
            show_remove_link: true,
          }, 
        }),
        $imageHtml = $(imageHtml);
    
    $imageHtml.data('json', image_json);
    
    // bind remove button
    $imageHtml.find('.remove').click(function() {
      if (confirm('Delete this file from the Image Library?')) {
        var $imageGridItem = $(this).parent('.image-grid-item'),
            imageId = $imageGridItem.data('json')._id;
        
        $imageGridItem.remove();
        H.getJSON('/json/image/' + imageId + '/delete', function() {
          // has been deleted now;
        });
      };
    });
  
    // bind edit button
    $imageHtml.find('.edit').click(function() {
      var $imageGridItem = $(this).parent('.image-grid-item'),
          imageId = $imageGridItem.data('json')._id;
      
      ImagePropertiesController.init(imageId);
      ImagePropertiesController.show();
    });


    $('#image-library').prepend($imageHtml);
  },

};
