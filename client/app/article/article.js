'use strict';

angular.module('photoblogApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('articlesList', {
        url: '/listarticles',
        templateUrl: 'app/article/partials/article_list.html',
        controller: 'ArticleController',
        controllerAs: 'vm'
      })
      .state('articlesEdit', {
        url: '/article/:id/view',
        templateUrl: 'app/article/partials/article_form.html',
        controller: 'EditArticleController',
        controllerAs: 'vm',
        resolve: {
          action: function() {
            return {value: 'view'};
          }
        }
      })
      .state('articlesNew', {
        url: '/articles/new',
        templateUrl: 'app/article/partials/article_form.html',
        controller: 'NewArticleController',
        controllerAs: 'vm',
        resolve: {
          action: function() {
            return {value: 'new'};
          }
        }
      })
      .state('articleView', {
        url: '/article/:id',
        templateUrl: 'app/article/partials/article.html',
        controller: 'ViewArticleController',
        controllerAs: 'vm',
        resolve: {
          action: function() {
            return {value: 'view'};
          }
        }
      })

  });
