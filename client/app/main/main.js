'use strict';

angular.module('photoblogApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: '/app/main/partials/main.html',
        controller: 'MainController',
        controllerAs: 'vw'
      });
  });
