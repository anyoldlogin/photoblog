(function() {
'use strict';

angular.module('photoblogApp')
  .service('uuid', function() {
    var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    this.generate = function() {
      return fmt.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    };
  });
})();
