(function() {
  'use strict';

  angular.module('photoblogApp')
    .controller('NavbarCtrl', NavbarCtrl);

  NavbarCtrl.$inject = ['$scope', '$location', 'Auth'];

  function NavbarCtrl($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': 'main'
    }, {
      'title': 'About',
      'link': 'about'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  };
})();
