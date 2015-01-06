var Popup = function() {
  $('#popup-content').empty();
  
  $('#popup-close').unbind('click').bind('click', function() {
    $('#popup').hide();
  });
};


Popup.prototype = {
  html: function($html) {
    $('#popup-content').html($html);
  },
  
  show: function() {
    $('#popup').show();
  },
  
  hide: function() {
    $('#popup').hide();
  }
};