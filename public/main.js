(function() {
  var app;

  app = angular.module('myApp', []);

  app.controller('HomeCtrl', function($scope) {
    return $scope.test = 'SuperChat';
  });

}).call(this);
