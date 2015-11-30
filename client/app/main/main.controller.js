(function() {
    'use strict';

    angular.module('photoblogApp')
      .controller('MainController', MainController);

    MainController.$inject = ['Article'];

    function MainController(Article) {
      var vm = this;
      vm.articles = Article.query();


    };
})();
