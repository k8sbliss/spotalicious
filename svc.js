app.service('svc', function($http){

$http.defaults.headers.common['X-Parse-Application-Id'] = 'cvL2s9ik9MgJWhBJt3l8LXrXT7fDcKpKp02iClyK';
$http.defaults.headers.common['X-Parse-REST-API-Key'] = 'Ep63cmimTLucRd9IAwTTGBJMpF7DoIee3KdYxWlj';


	this.getSched = function(){
		return $http.get('https://api.parse.com/1/classes/schedule/');
	}

	this.getSpotted = function(){
		return $http.get('https://api.parse.com/1/classes/spotted/');
	}

	this.getVendor = function(){
		return $http.get('https://api.parse.com/1/classes/vendor/');
	}

	this.spottedYes = function(sched){
		var newSched = {};
		angular.copy(sched, newSched);
		newSched.spotted++;
		return $http.put('https://api.parse.com/1/classes/schedule/' + newSched.objectId, newSched);
	}
	this.spottedNo = function(sched){
		var newSched = {};
		angular.copy(sched, newSched);
		newSched.noshow++;
		return $http.put('https://api.parse.com/1/classes/schedule/' + newSched.objectId, newSched);
	}

	this.spotVen = function(entry){
		return $http.post('https://api.parse.com/1/classes/spotted/', entry);
	}

	this.sugVen = function(entry){
		return $http.post('https://api.parse.com/1/classes/vendorSuggestion/', entry);
	}

	this.getComments = function(){
		return $http.get('https://api.parse.com/1/classes/comments/');
	}

	this.addComment = function(com){
		return $http.post('https://api.parse.com/1/classes/comments/', com);
	}

});