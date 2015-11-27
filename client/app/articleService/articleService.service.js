(function() {
  'use strict';

angular.module('photoblogApp')
  .factory('Article', Article);

  Article.inject = ['$resource'];

  function Article($resource) {
    return $resource('/api/articles/:id', {id: '@_id'} , {get:{method:'GET', isArray:false} });
  }
})();
