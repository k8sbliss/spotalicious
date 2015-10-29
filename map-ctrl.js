app.controller('map-ctrl', function($scope, svc) {

$scope.$on('mapInitialized', function(event, map) {

});

$scope.mapview = [];
$scope.markerList = [];
var today = moment().format('MMM DD');


svc.getSched().then(function(data){
  $scope.mapview = data.data.results; 

  for (var i = 0; i < $scope.mapview.length; i++){

    var ftd8 = $scope.mapview[i].date;

    if (ftd8 === today){
       $scope.markerList.push({
          pos: $scope.mapview[i].locadd,
          name: $scope.mapview[i].name,
          d8: $scope.mapview[i].date,
          vId: $scope.mapview[i].vendorId,
        }); 
    }
  }

});



});