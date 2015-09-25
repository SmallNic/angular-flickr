var app = angular.module('katiepicnic', ['ui.router', 'ngResource']); //declare dependencies


//Setup Controller
app.controller('MainCtrl', [
  '$scope',
  '$stateParams',
  'pic_ids',
  'pic_urls',
  'pic_descrip',
  function($scope, $stateParams, pic_ids, pic_urls, pic_descrip){
    $scope.photo_ids = [];
    $scope.photo_urls = [];
    $scope.photo_descrips = [];
    $scope.photos = [];
    // $scope.photo = "";
    $scope.photo = $scope.photos[$stateParams.id];

    $scope.index = 0;

    $scope.newPhoto = function(){
      console.log("$scope.photo", $scope.photo)
      previousID = $scope.photo.id
      index = Math.floor(Math.random()*$scope.photos.length)
      nextID = $scope.photos[index].id
      sameAsLast = true
      while(sameAsLast == true){
        if (previousID == nextID){
          index = Math.floor(Math.random()*$scope.photos.length);
          nextID = $scope.photos[index].id;
        }
        else {
          $scope.photo = $scope.photos[index]
          sameAsLast = false;
        }
      }

    }


    pic_ids.get().then(function(response){
      photosetData = JSON.parse(response.data.substring(14, response.data.length-1))
      for(var i = 0; i < photosetData.photoset.photo.length; i ++){
        photo_id = photosetData.photoset.photo[i].id
        $scope.photo_ids.push(photo_id)
        $scope.photos.push({id:photo_id})
        // console.log(i, "photo_id", photo_id)
      }
    }).then(function(){
      counter = 0
      $.each($scope.photo_ids, function(index, id) {
        pic_urls.get(id).then(function(response){
          picSizeData = JSON.parse(response.data.substring(14, response.data.length-1))
          var sizeIndex;
          var thumbIndex;
          $.each(picSizeData.sizes.size, function(sizeInd){
            if (picSizeData.sizes.size[sizeInd].label == "Large Square"){
              thumbIndex = sizeInd;
            }
            if (picSizeData.sizes.size[sizeInd].label == "Medium 800"){
              sizeIndex = sizeInd;
            }
            else if (picSizeData.sizes.size[sizeInd].label == "Original"){
              sizeIndex = sizeInd;
            }
          })
          if (picSizeData.sizes.size.length > 0){
            counter++
          }
          console.log("counter", counter)
          // console.log("picSizeData.sizes.size[10].source", picSizeData.sizes.size[10].source)
          console.log("picSizeData.sizes.size[sizeIndex]", picSizeData.sizes.size[sizeIndex])
          console.log("picSizeData.sizes", picSizeData.sizes)
          console.log("picSizeData", picSizeData)
          url = picSizeData.sizes.size[sizeIndex].source;
          thumbUrl = picSizeData.sizes.size[thumbIndex].source;
          console.log("index", index, "-", id, "url:", url)
          $.each($scope.photos, function(index){
            if($scope.photos[index].id == id){
              $scope.photos[index].url = url
              $scope.photos[index].thumb = thumbUrl

            }
          })

          $scope.photo_urls.push(url)
        })
      })

      $.each($scope.photo_ids, function(index, id) {
        pic_descrip.get(id).then(function(response){
          picData = JSON.parse(response.data.substring(14, response.data.length-1))
          descrip = picData.photo.description._content;
          console.log("index", index, "-", id, "descrip:", descrip)

          $.each($scope.photos, function(index){
            if($scope.photos[index].id == id){
              $scope.photos[index].descrip = descrip
            }
          })

          $scope.photo_descrips.push(descrip)
        })
      })

    }).then(function(){
      $scope.photo = $scope.photos[$stateParams.id];

      // console.log("index", $scope.index)
      // console.log("id", $scope.photo_ids[$scope.index])
      //
      // $scope.index  = Math.floor(Math.random()*$scope.photo_ids.length);
      // $scope.photo = ({id:$scope.photo_ids[index], url:$scope.photo_urls[index], descrip:$scope.photo_descrips[index]})
      // console.log("$scope.photo", $scope.photo)
    }).then(function(){
      console.log("$scope.photo_ids", $scope.photo_ids)

    })

  }
])      // for(var j = 0; j < numPhotos; j ++){
  //   $scope.photos.push({id:$scope.photo_ids[j], url:$scope.photo_urls[j], descrip:$scope.photo_descrips[j]})
  // }
  //
  // console.log("$scope.photos", $scope.photos)
  // console.log("$scope.photo", $scope.photo)
  // counter++;


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
        url: 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f171555321fcc7e567ecafaaf8c27c38&photoset_id=72157659074048001&user_id=130920742@N07&format=json',
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
    })
    .state('pics', {
      url: '/pics/{id}',
      templateUrl: '/pics.html',
      controller: 'MainCtrl'
    })

    $urlRouterProvider.otherwise('home');
  }
])
