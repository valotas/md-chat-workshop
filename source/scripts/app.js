(function (window, $, undefined) {
  'use strict';

  // Our main application module
  angular.module('chatApp', [])

    .controller('ChatCtrl', function ($scope) {
      // Initialize controller variables
      $scope.messageText = '';
      $scope.credentials = {
        userName: '',
        email: ''
      };

      // Controller login and logout function
      $scope.login = function () {
        $scope.isLoggedIn = true;
      };
      $scope.logout = function () {
        // Close any offcanvas first
        $('.off-canvas-wrap').removeClass('move-right');
        $scope.isLoggedIn = false;
      };

      $scope.isLoggedIn = false;
    });

}(window, jQuery));