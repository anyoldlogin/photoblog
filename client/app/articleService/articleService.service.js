(function() {
  'use strict';

angular.module('photoblogApp')
  .factory('Article', Article);

  Article.inject = ['Restangular'];

  function Article(Restangular) {
    var service = Restangular.service('articles');
    var  factory = {
      one: service.one,
      getList: service.getList,
      
    }

    return factory;
  }
})();
