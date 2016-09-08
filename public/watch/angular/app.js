const app = angular.module('spacepopetv', []);
app.controller('tvController', function ($scope) {
  $scope.videos = initial;
  $scope.watched = watched || [];
  $scope.queue = initial.slice(0,5);
  $scope.newVideo = function (url) {
    url = 'https://www.youtube.com/embed/' + url.replace(/https?:.+watch\?v=/, '');
    $('#ytplayer').attr('src', url);
  }
  //should change watched to object full of videos as keys, for faster lookup time;
  //augment so watchjs is not needed; use query string on 
  $scope.setAsWatched = function (index) {
    $scope.newVideo($scope.queue[index].url)
    $scope.watched.push($scope.queue[index]._id);
    $scope.updateQueue();
    jQuery.post('/watched', { data: $scope.watched });
  }
  $scope.getData = function() {
      
  }
  $scope.updateQueue = function () {
    const newVideos = [];
    for (let video of $scope.videos) {
      if ($scope.watched.indexOf(video._id) == -1) {
        if (/youtube/.test(video.url)) {
          newVideos.push(video);
        }
        if (newVideos.length === 5) break;
      }
    }
    $scope.queue = newVideos;
  }
  $scope.updateQueue();
});