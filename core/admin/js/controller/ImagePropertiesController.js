/* global Toast */
/* global H */
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
    H.getJSON('/json/image/' + imageId, function(json) {
      self._imageJSON = json;
      self._imageJSON.alt_text = json.alt_text || '';
      self._imageJSON.caption = json.caption || '';
      self._imageJSON.description = json.description || '';
      
      var imagePropertiesHtml = new EJS({element: 'tmpl-image-properties'}).render(self._imageJSON);
      
      // append to DOM
      self.$el.append($(imagePropertiesHtml));
      
      // bind save button
      self.$el.find('button[data-purpose="save"]').click(function() {
        var title = self.$el.find('input[data-property="title"]').val(),
            caption = self.$el.find('input[data-property="caption"]').val(),
            alt_text = self.$el.find('input[data-property="alt_text"]').val(),
            description = self.$el.find('textarea[data-property="description"]').val();
            
        // merge into image JSON ...
        self._imageJSON.title = title;
        self._imageJSON.caption = caption;
        self._imageJSON.alt_text = alt_text;
        self._imageJSON.description = description;

        // ... and update data on server
        H.postJSON('/json/image/' + self._imageId + '/update', self._imageJSON, function() {
          var toast = new Toast('Saved.');
          self.hide();
        });

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