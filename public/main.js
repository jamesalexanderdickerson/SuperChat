(function() {
  var app;

  app = angular.module('myApp', ['ngSanitize']);

  app.factory('socket', function ($rootScope) {
    var socket = io();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });
  app.directive('ngScrollBottom', ['$timeout', function ($timeout) {
    return {
      scope: {
        ngScrollBottom: "="
      },
      link: function ($scope, $element) {
        $scope.$watchCollection('ngScrollBottom', function (newValue) {
          if (newValue) {
            $timeout(function(){
              $element[0].scrollTop = $element[0].scrollHeight;
            }, 0);
          }
        });
      }
    }
  }]);

  app.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.tabs = ['Login', 'Register'];
    $scope.tabs.index = 1;
    $scope.tabs.active = function () {
      return $scope.tabs.[$scope.tabs.index];
    }
    $http.get('/')
      .success(function(data) {

      })
    $http.get('/user')
      .success(function(data) {
        console.log(data)
      })
      .error(function(data) {
        console.log('Error: ' + data)
      })
  }])
  app.controller('HomeCtrl', ['$scope', '$http', 'socket', '$timeout', function($scope, $http, socket, $timeout) {
    $http.get('/')
      .success(function(data) {

      })
    $http.get('/chat')
       .success(function(data) {
           $scope.messages = data.reverse();
           console.log(data);
       })
       .error(function(data) {
           console.log('Error: ' + data);
       });

    $scope.onSubmit = function(){
       socket.emit('chat message',$scope.lmessage)
       $scope.lmessage = ""
       $scope.shake = true
       $timeout(function() {
        $scope.shake = false
       }, 820)
    }

    socket.on('chat message', function (msg) {
      console.log('msg',msg);
      $scope.messages.push({message: msg});
    });

  }]);

}).call(this);
