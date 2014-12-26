ImageController = {
  list: function() {
    var self = this;

    $('*[data-purpose="upload-form"]').submit(function() {
      var imageUpload = new ImageUploader($(this), function(image) {
        ImageController._addImage(image);
      });

      return false;
    });
    
    $.getJSON('/json/images', function(images) {
      images.forEach(function(image) {
        ImageController._addImage(image);
      });
    });
  },
  
  _addImage: function(image_json) {
    var self = this,
        imageHtml = new EJS({element: 'tmpl-image-grid-item'}).render({image: image_json}),
        $imageHtml = $(imageHtml);
    
    $imageHtml.data('json', image_json);
    $imageHtml.find('.remove').click(function() {
      if (confirm('Delete this file from the Image Library?')) {
        var $imageGridItem = $(this).parent('.image-grid-item'),
            imageId = $imageGridItem.data('json')._id;
        
        $imageGridItem.remove();
        $.getJSON('/json/image/' + imageId + '/delete', function() {
          // has been deleted now;
        });
      };
    });
  
    $('#image-library').prepend($imageHtml);
  },

};
