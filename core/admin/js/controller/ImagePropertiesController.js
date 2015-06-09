/* global EJS */
/* global ImagePropertiesController */

ImagePropertiesController = {
  $el: undefined,
  _imageId: undefined,
  _imageJSON: undefined,
  
  init: function(imageId) {
    var self = this,
        html = new EJS({element: 'tmpl-image-property-editor'}).render({});

    this._imageId = imageId;
    this.$el = $(html);
    this.bind();

    // fetch data
    $.getJSON('/json/image/' + imageId, function(json) {
      self._imageJSON = json;
      self._imageJSON.alt_text = json.alt_text || '';
      self._imageJSON.caption = json.caption || '';
      self._imageJSON.description = json.description || '';

      console.log(self._imageJSON);
      
      var imagePropertiesHtml = new EJS({element: 'tmpl-image-properties'}).render(self._imageJSON);
      self.$el.append($(imagePropertiesHtml));
      self.$el.find('button[data-purpose="save"]').click(function() {
        console.log('save image properties...');
      });
    });
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