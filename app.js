var app = angular.module('katiepicnic', ['ui.router', 'ngResource']); //declare dependencies


//Setup Controller
app.controller('MainCtrl', [
  '$scope',
  'pic_ids',
  'pic_urls',
  'pic_descrip',
  function($scope, pic_ids, pic_urls, pic_descrip){
    $scope.photo_ids = [];
    $scope.photo_urls = [];
    $scope.photo_descrips = [];
    $scope.photos = [];
    $scope.photo = ""
    $scope.newPhoto = function(){
      // console.log("click")
      $scope.photo = $scope.photos[Math.floor(Math.random()*$scope.photos.length)];
    }

    pic_ids.get().then(function(response){
      photosetData = JSON.parse(response.data.substring(14, response.data.length-1))
      for(var i = 0; i < photosetData.photoset.photo.length; i ++){
        photo_id = photosetData.photoset.photo[i].id
        $scope.photo_ids.push(photo_id)
        console.log(i, "photo_id", photo_id)
      }
    }).then(function(){
      numPhotos = $scope.photo_ids.length
      for(var i = 0; i < numPhotos; i ++){
        photo_id = $scope.photo_ids[i]

        pic_urls.get(photo_id).then(function(response){
          picSizeData = JSON.parse(response.data.substring(14, response.data.length-1))
          url = picSizeData.sizes.size[10].source;
          console.log("url:", url)
          $scope.photo_urls.push(url)
        }).then(function(){

          pic_descrip.get(photo_id).then(function(response){
            picData = JSON.parse(response.data.substring(14, response.data.length-1))
            descrip = picData.photo.description._content;
            console.log(photo_id, "descrip:", descrip)
            $scope.photo_descrips.push(descrip)
          }).then(function(){

            for(var i = 0; i < $scope.photo_ids.length; i ++){
              $scope.photos.push({id:$scope.photo_ids[i], url:$scope.photo_urls[i], descrip:$scope.photo_descrips[i]})
            }
            $scope.photo  = $scope.photos[Math.floor(Math.random()*$scope.photos.length)];
            console.log("$scope.photos", $scope.photos)
            console.log("$scope.photo", $scope.photo)
          })
        })
      }
    })
  }
])

          /*
          console.log("picSizeData", picSizeData)
          for (var j =0; j < picSizeData.sizes.size.length; j++){
            // console.log(picSizeData.sizes.size[j].label)
            if (picSizeData.sizes.size[10].label
              console.log(i,"",url)

              pic_descrip.get(photo_id).then(function(response){
                picData = JSON.parse(response.data.substring(14, response.data.length-1))
                console.log("picData", picData)
                descrip = picData.photo.description._content;
                console.log("url", url)
                console.log("descrip", descrip)
                $scope.photo_urls.push({url:url, descrip:descrip})
              })
            }

          */


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
  return {
    get: function(pic_url) {
      return $http({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=f171555321fcc7e567ecafaaf8c27c38&photo_id='+pic_url+'&format=json',
        method: 'get',
      })
    }
  }
}]);


app.factory('pic_descrip', ['$http', function($http){
  return {
    get: function(pic_id) {
      return $http({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=f171555321fcc7e567ecafaaf8c27c38&photo_id='+pic_id+'&format=json',
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
