var Toast = function(html) {
  var self = this;
  
  $('#toast').html('<div>' + html + '</div>');
  this.show();
};

Toast.prototype = {
  show: function() {
    var self = this;
    $('#toast').show();

    setTimeout(function() {
      $('#toast').css('opacity', '1');
    }, 0);
  
    setTimeout(function() {
      self.hide();    
    }, 1600);  
  },
  
  hide: function() {
    $('#toast').css('opacity', '0');
    setTimeout(function() {
      $('#toast').hide();
    }, 500);
  }
};