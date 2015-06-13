/* global H */
/* global Toast */
/* global js_beautify */
/* global CodeMirror */
/* global SettingsController */

SettingsController = {
  _editor: undefined,
  
  init: function() {
    var self = this;
      
    $.getJSON('/admin/bp-settings.json', function(settings) {
      var settingsStr = js_beautify(JSON.stringify(settings));
      
      // populate textfield with settings.json to be used by CodeMirror
      $('#settings-codemirror').val(settingsStr);
      self.bind();
    });

  },
  
  bind: function() {
    var self = this;
    
    // bind CodeMirror to TextField
    this._editor = CodeMirror.fromTextArea(document.getElementById('settings-codemirror'), {
      mode: 'javascript',
      lineNumbers: true,
      theme: "default",
      lineWrapping: false,
    });      
  
    // bind save button
    $('#bp-settings-save-btn').click(function() {
      var settingsStr = self._editor.getValue();

      try {
        var json = JSON.parse(settingsStr);  // test if that's valid JSON
        self.postSettings(settingsStr);  // but post the string to keep beautification
      } catch(e) {
        alert('Sorry, this seems to be not valid JSON.');
      }
    });
  },
  
  postSettings: function(settingsStr) {
    $.post('/admin/bp-settings.json', {settings: settingsStr}, function() {
      new Toast('Saved');
    }, 'text');
  }
};