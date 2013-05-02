angular.module('angular-restful', ['angular-restful.service'])
.run(function($rootScope, $restful, Gem){
	$restful.$baseURL = 'http://angular-restful-6072.sae1.actionbox.io:3000';
	$rootScope.gem = Gem.get();
});