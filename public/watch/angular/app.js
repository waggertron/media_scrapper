const app = angular.module('spacepopetv', []);
app.controller('tvController', function ($scope) {
  $scope.videos = initial;
  $scope.watched = watched || [];
  $scope.queue = initial.slice(0,5);
  $scope.newVideo = function (url) {
    url = 'https://www.youtube.com/embed/' + url.replace(/https:.+watch\?v=/, '');
    $('#ytplayer').attr('src', url);
  }
  $scope.setAsWatched = function (index) {
    $scope.newVideo($scope.queue[index].url)
    $scope.watched.push($scope.queue[index]._id);
    $scope.updateQueue();
    jQuery.post('/watched', { data: $scope.watched });
    $scope.updateQueue();
  }
  $scope.getData = function() {
      
  }
  $scope.updateQueue = function () {
    const newVideos = [];
    for (let video of $scope.videos) {
      if ($scope.watched.indexOf(video._id) == -1) {
        newVideos.push(video);
        if (newVideos.length === 5) break;
      }
    }
    $scope.queue = newVideos;
  }
});