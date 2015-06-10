ImageUploader = function($html, callback) {
  this.$el = $html;
  
  var formData = new FormData(this.$el[0]);
  
  $.ajax({
    url: this.$el.attr("action"),
    type: 'POST',
    data: formData,
    success: function (data) {
      callback(data);
    },
    cache: false,
    contentType: false,
    processData: false
  });

  return false;
};








