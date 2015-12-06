(function() {
'use strict';

angular.module('photoblogApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'formly',
  'formlyBootstrap',
  'restangular',
  'angularUtils.directives.dirPagination'

])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider) {
    $urlRouterProvider
      .when('/', '/articles')
      .otherwise("/articles");

    RestangularProvider.setBaseUrl('/api/');
    RestangularProvider.setRestangularFields({
      id: "_id",
    });

    $stateProvider
    .state('articles', {
      url: '/articles',
      templateUrl: 'app/article/partials/articles.html',
      controller: 'ArticleController',
      controllerAs: 'vm'
    })
    .state('article', {
      url: '/article/:id',
      templateUrl: 'app/article/partials/post.html',
      controller: 'ViewArticleController',
      controllerAs: 'vm'
    })
      .state('about', {
        url: '/about',
        templateUrl: '/app/main/partials/about.html'
      });
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
})();
