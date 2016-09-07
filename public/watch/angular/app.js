const app = angular.module('spacepopetv', []);
app.controller('tvController', function ($scope) {
  $scope.videos = [];
  $scope.watched = [];
  $scope.test = initial;
  $scope.newVideo = function () {
    url = 'https://www.youtube.com/embed/' + url.replace(/https:.+watch\?v=/, '');
  }
  $scope.setAsWatched = function () {

  }
  $scope.getData = function() {
      
  }
});