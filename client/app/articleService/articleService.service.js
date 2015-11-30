(function() {
  'use strict';

angular.module('photoblogApp')
  .factory('Article', Article);

  Article.inject = ['Restangular'];

  function Article(Restangular) {
    var  factory = Restangular.service('articles');

    return factory;
  }
})();
