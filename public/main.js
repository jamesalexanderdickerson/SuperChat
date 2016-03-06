(function() {
  var app;

  app = angular.module('myApp', []);

  app.controller('HomeCtrl', function($scope, $http) {
    $scope.scrollJump = function () {
      var chatWindow = document.getElementById("messages")
      chatWindow.scrollTop = chatWindow.scrollHeight
      chatWindow.scrollHeight = chatWindow.scrollHeight
    }
    $http.get('/chat')
       .success(function(data) {
           $scope.messages = data;
           console.log(data);
       })
       .error(function(data) {
           console.log('Error: ' + data);
       });
    return $scope.test = 'SuperChat'

  });

}).call(this);
