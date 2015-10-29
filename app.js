var app = angular.module('app', ['smart-table', 'ui.router', 'ngMap']);

app.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home/weeklylist');
    
    $stateProvider

    .state('home', {
        url: '/home',
        templateUrl: 'pages/home.html',
        controller: 'main-ctrl'
    })
 
    .state('home.list1', {
        url: '/weeklylist',
        templateUrl: 'pages/list1.html',
        controller: 'main-ctrl'
    })

    .state('home.list2', {
        url: '/justspotted',
        templateUrl: 'pages/list2.html',
        controller: 'main-ctrl'
    })

    .state('home.mapview', {
        url: '/mapview',
        templateUrl: 'pages/mapview.html',
        controller: 'map-ctrl'
    })

    .state('home.vendor', {
        url: '/vendors/:id',
        templateUrl: 'pages/vendor.html',
        controller: 'vendors-ctrl'
    })

    .state('vendors', {
        url: '/vendors',
        templateUrl: 'pages/vendors.html',
        controller: 'vendors-ctrl'
    })

    .state('suggestvendor', {
        url: '/vendorform',
        templateUrl: 'pages/suggestvendor.html',
        controller: 'vendor2-ctrl'
    })

    .state('suggestvendorsuccess', {
        url: '/vendorformsuccess',
        templateUrl: 'pages/suggestvendorsuccess.html',
        controller: 'vendor2-ctrl'
    })
 
     .state('about', {
        url: '/about',
        templateUrl: 'pages/about.html',
        controller: 'main-ctrl'
    })

     .state('home.addComment', {
        url: '/comment/:id2',
        templateUrl: 'pages/addcomment.html',
        controller: 'com-ctrl'
    })

     .state('home.spotsubmitform', {
        url: '/spotsubmitform',
        templateUrl: 'pages/spotsubmitform.html',
        controller: 'spot-ctrl'
    })

     .state('home.spotsubmitsuccess', {
        url: '/spotsubmitsuccess',
        templateUrl: 'pages/spotsubmitsuccess.html',
        controller: 'spot-ctrl'
    })

     .state('home.comsubmitsuccess', {
        url: '/comsubmitsuccess',
        templateUrl: 'pages/comsubmitsuccess.html',
        controller: 'spot-ctrl'
    })


});

app.controller('spot-ctrl', function($scope, $state, svc) {

    $scope.entry = {};
    $scope.vendors = [];
    var today = moment().format('MMM DD');

    svc.getVendor().then(function(data){
        $scope.vendors = data.data.results;
    });

    $scope.clear = function(){
        $scope.entry = {};
    };

    //after form submission, send the new post to the api, and redirects to success page
    $scope.spotVendor = function(isValid){
        if (isValid){

            for (var i = 0; i < $scope.vendors.length; i++){

                var vname = $scope.vendors[i].name;
                
                if(vname == $scope.entry.name){
                    var id = $scope.vendors[i].vendorId;
                    $scope.entry.vendorId = id;
                    $scope.entry.date = today;

                }
            };

            svc.spotVen($scope.entry).then(function(){
                $state.go('home.spotsubmitsuccess');
         });
        }

    };
    
});

app.controller('vendor2-ctrl', function($scope, $state, svc) {

    $scope.entry = {};

    $scope.clear = function(){
        $scope.entry = {};
    };

    //after form submission, send the new post to the api, and redirects to success page
    $scope.sugVendor = function(isValid){
        if (isValid){

            svc.sugVen($scope.entry).then(function(){
                $state.go('suggestvendorsuccess');
         });
        }

    };
    
});

app.controller('vendors-ctrl', function($scope, $stateParams, $state, svc) {

    // get and view a single entry from the api
    $scope.vendor = [];
    $scope.comments = [];
    $scope.venCom = [];

    svc.getVendor().then(function(data){
        $scope.vendor = data.data.results;

        for (var i = 0; i < $scope.vendor.length; i++){

            var vId = $scope.vendor[i].vendorId;
            
            if(vId == $stateParams.id){
                $scope.singleVendor = $scope.vendor[i];
            }
        }

    });

    svc.getComments().then(function(data){
        $scope.comments = data.data.results;

          for (var i = 0; i < $scope.comments.length; i++){

            var vId = $scope.comments[i].vendorId;

            if (vId == $stateParams.id){
               $scope.venCom.push({
                  user: $scope.comments[i].user,
                  com: $scope.comments[i].comment,
                  d8: $scope.comments[i].date,
                  vId: $scope.comments[i].vendorId,
                  cNum: $scope.comments[i].comNum
                }); 
            }
          }
    });


});

app.controller('main-ctrl', function($scope, svc, $filter, $state, $stateParams) {

    $scope.schedule = [];
    $scope.spotted = [];

    //get all sched from api
    svc.getSched().then(function(data){
            $scope.schedule = data.data.results;            
    });


    //copy api data to displayed smart table
    $scope.displayedSched = [].concat($scope.schedule);
    $scope.predicates = ['date', 'mealtime', 'name', 'city', 'locname', 'time', 'loc'];
    $scope.selectedPredicate = $scope.predicates[0];

    //get all spotted from api
    svc.getSpotted().then(function(data){
            $scope.spotted = data.data.results;
    });

    $scope.displayedSpot = [].concat($scope.spotted);

    $scope.spotYes = function(sched){
        svc.spottedYes(sched).then(function(){
            sched.spotted++;
        });
    };

    $scope.spotNo = function(sched){
        svc.spottedNo(sched).then(function(){
            sched.noshow++;
        });
    };

    $scope.showMap = function(add){
        // var link = ""+"http://maps.google.com/maps?saddr="+add;
        //     //window.location = link;
        //     window.open(link, '_blank');

var link = ""+"http://maps.google.com/maps?saddr="+add;
var link2 = ""+"maps://maps.google.com/maps?saddr="+add;


    if( (navigator.platform.indexOf("iPhone") != -1) 
            || (navigator.platform.indexOf("iPod") != -1)
            || (navigator.platform.indexOf("iPad") != -1)
            || (navigator.platform.indexOf("Android") != -1)
            || (navigator.platform.indexOf("BlackBerry") != -1))
             window.open(link2);

    else
             window.open(link, '_blank');

        };



});

app.controller('com-ctrl', function($scope, $stateParams, $state, svc) {

    $scope.comm = {};
    var choice = 0;
    var today = moment().format('MMM DD');
    var comCt = 0;

    svc.getComments().then(function(data){
        $scope.comments = data.data.results;
        comCt = $scope.comments.length + 1;
    });


    svc.getSched().then(function(data){
            $scope.schedule = data.data.results;            
    
        for (var i = 0; i < $scope.schedule.length; i++){

            var oId = $scope.schedule[i].objectId;
            
            if(oId == $stateParams.id2){
                $scope.singleSched = $scope.schedule[i];
            }

        }

    });

    $scope.clear = function(){
        $scope.comm = {};
    };

    $scope.addComment = function(isValid){
        if (isValid){


            if ($scope.choice === 2){
                svc.spottedNo($scope.singleSched);
            };

            if ($scope.choice === 1){
                svc.spottedYes($scope.singleSched);
            };
            
            $scope.comm.date = today;
            $scope.comm.vendorId = $scope.singleSched.vendorId;
            $scope.comm.comNum = comCt++;
            svc.addComment($scope.comm).then(function(){
                $state.go('home.comsubmitsuccess');
            });
        }

    };

});

//smart table filters
app.filter('myStrictFilter', function($filter){
    return function(input, predicate){
        return $filter('filter')(input, predicate, true);
    }
});

app.filter('unique', function() {
    return function (arr, field) {
        var o = {}, i, l = arr.length, r = [];
        for(i=0; i<l;i+=1) {
            o[arr[i][field]] = arr[i];
        }
        for(i in o) {
            r.push(o[i]);
        }
        return r;
    };
});

//END

