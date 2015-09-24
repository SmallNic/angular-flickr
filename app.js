var app = angular.module('katiepicnic', ['ui.router', 'ngResource']); //declare dependencies


//Setup Controller
app.controller('MainCtrl', [
  '$scope',
  'pic_ids',
  'pic_urls',
  function($scope, pic_ids, pic_urls){
    $scope.photo_ids = [];
    $scope.photo_urls = [];
    $scope.photo_url = ""
    $scope.newPhoto = function(){
      console.log("click")
      $scope.photo_url = $scope.photo_urls[Math.floor(Math.random()*$scope.photo_urls.length)];
    }

    pic_ids.get().then(function(response){
      data = JSON.parse(response.data.substring(14, response.data.length-1))
      console.log("data:", data)

      for(var i = 0; i < data.photoset.photo.length; i ++){

        //select photo id and store all of them in an array
        photo_id = data.photoset.photo[i].id
        $scope.photo_ids.push(photo_id)

        pic_urls.get(photo_id).then(function(response){
          picSizeData = JSON.parse(response.data.substring(14, response.data.length-1))
          for (var j =0; j < picSizeData.sizes.size.length; j++){
            // console.log(picSizeData.sizes.size[j].label)
            if (picSizeData.sizes.size[j].label === "Original"){
              console.log(picSizeData.sizes.size[j].source)
              $scope.photo_urls.push(picSizeData.sizes.size[j].source)
            }
          }
          console.log("$scope.photo_urls", $scope.photo_urls)

        }).then(function(response){
          $scope.photo_url  = $scope.photo_urls[Math.floor(Math.random()*$scope.photo_urls.length)];
          console.log("$scope.photo_url", $scope.photo_url)

        })
      }

      console.log("$scope.photo_ids", $scope.photo_ids)

    })

  }
])


//Setup Factory to hold the data

app.factory('pic_ids', ['$http', function($http){

  return {
    get: function(){
      return  $http({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f171555321fcc7e567ecafaaf8c27c38&photoset_id=72157656804418182&user_id=130920742@N07&format=json',
        method: 'get',
      })
    }
  }


  // return {
  //   get: $http.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f171555321fcc7e567ecafaaf8c27c38&photoset_id=72157656804418182&user_id=130920742@N07&format=json')
  // }

}]);


app.factory('pic_urls', ['$http', function($http){
  console.log("this", $(this))
  return {
    get: function(pic_url) {
      return $http({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=f171555321fcc7e567ecafaaf8c27c38&photo_id='+pic_url+'&format=json',
        method: 'get',
      })
    }
  }
}]);


//Setup Routes
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });

    $urlRouterProvider.otherwise('home');
  }
])
