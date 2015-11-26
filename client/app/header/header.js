'use strict';

angular.module('photoblogApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('header', {
        url: '/header',
        templateUrl: 'app/header/header.html',
        controller: 'HeaderCtrl'
      });
  });