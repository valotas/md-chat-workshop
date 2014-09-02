(function (window, $, undefined) {
  'use strict';

  // Our main application module
  angular.module('chatApp', ['utilities', 'gravatar', 'firebase'])

    .constant('chatDbUrl', 'https://ctpwebtech.firebaseio.com/')

    .factory('chatService', function ($firebase, $rootScope, chatDbUrl) {
      var chatRef,
        connRef,
        userRef,
        connected = false;

      // Login service function that establishes a connection to firebase and registers onDisconnect hook
      function login(credentials) {
        chatRef = new window.Firebase(chatDbUrl + 'chat');
        connRef = new window.Firebase(chatDbUrl + '.info/connected');
        userRef = new window.Firebase(chatDbUrl + 'chat/users/' + credentials.userName);

        connRef.on('value', function (snapshot) {
          if (snapshot.val()) {
            userRef.onDisconnect().remove();
            userRef.set({
              presence: 'online',
              userName: credentials.userName,
              email: credentials.email
            });

            var firebase = $firebase(chatRef, $rootScope, 'chat');
            firebase.$bind($rootScope, 'chat');
            connected = true;

            $rootScope.$broadcast('connected');
          }
        });
      }

      // Logout function that disconnects all firebase connections and updates the internal state
      function logout() {
        window.Firebase.goOffline();
        chatRef = connRef = userRef = null;
        connected = false;
        $rootScope.$broadcast('disconnected');
      }

      function isLoggedIn() {
        return connected;
      }

      // If connected updates the presence state
      function updatePresence(state) {
        if (connected) {
          userRef.child('presence').set(state);
        }
      }

      return {
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        updatePresence: updatePresence
      };
    })

    .controller('ChatCtrl', function ($scope, chatService) {
      // Initialize controller variables
      $scope.messageText = '';
      $scope.credentials = {
        userName: '',
        email: ''
      };

      // Controller login and logout function
      $scope.login = function () {
        chatService.login($scope.credentials);
      };
      $scope.logout = function () {
        // Close any offcanvas first
        $('.off-canvas-wrap').removeClass('move-right');
        chatService.logout();
      };

      // isLoggedIn handling by observing the connected and disconnected events from chatService
      $scope.isLoggedIn = false;
      $scope.$on('connected', function () {
        $scope.isLoggedIn = true;
      });
      $scope.$on('disconnected', function () {
        $scope.isLoggedIn = false;
      });

      // Sending a message
      $scope.sendMessage = function () {
        // If there are no messages yet, we create the messages array
        $scope.chat.messages = $scope.chat.messages || [];

        $scope.chat.messages.push(
          {
            user: $scope.credentials,
            text: $scope.messageText,
            time: new Date()
          }
        );
        // Reset our message value that we use in the input binding
        $scope.messageText = '';
      };

      // Adding presence handling with ifvisible.js
      window.ifvisible.on('idle', function () {
        chatService.updatePresence('away');
      });
      window.ifvisible.on('wakeup', function () {
        chatService.updatePresence('online');
      });
    });

  angular.module('utilities', [])

    .filter('reverse', function () {
      return function (input) {
        if(input) {
          return input.slice().reverse();
        } else {
          return input;
        }
      };
    })

    .filter('fromNow', function () {
      return function (input) {
        return window.moment(input).fromNow();
      };
    });

  angular.module('gravatar', [])
    // Simple filter that uses a global md5 function to return md5 string of input
    .filter('md5', function () {
      return function (input) {
        return window.md5(input);
      };
    })
    // Our gravatar avatar directive that dynamically creates a gravatar image based on attributes
    .directive('gravAvatar', function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          gravEmail: '@',
          gravSize: '@'
        },
        template: '<img ng-attr-src="http://gravatar.com/avatar/{{gravEmail | md5}}?s={{ gravSize || 80 }}">'
      };
    });

}(window, jQuery));