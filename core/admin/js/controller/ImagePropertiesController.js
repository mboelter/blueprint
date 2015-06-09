/* global EJS */
/* global ImagePropertiesController */

ImagePropertiesController = {
  $el: undefined,
  
  init: function() {
    var html = new EJS({element: 'tmpl-image-property-editor'}).render({});
    this.$el = $(html);
    this.bind();
  },
  
  
  bind: function() {
    var self = this;

    // bind close button
    this.$el.find('.close').click(function() {
  	  self.hide();
    });
  },
  
  
  show: function() {
    var self = this;
  
    // blackout stuff  
    $('#blackout').show();
    setTimeout(function() {
      $('#blackout').css('opacity', '0.7');
    }, 0);
  
    $('body').append(this.$el);
  },
  
  
  hide: function() {
    $('#blackout').css('opacity', '0.0');
    setTimeout(function() {
      $('#blackout').hide();
    }, 200);
    
    this.$el.remove();
  }


};