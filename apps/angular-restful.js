angular.module('angular-restful', ['angular-restful.service'])
.config(function($httpProvider, $routeProvider) {

    $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    var views = './views';
    $routeProvider.when('/sample', {
        templateUrl: views+'/user/list.html',
        controller: UserController
    }).when('/sample/users', {
        templateUrl: views+'/user/list.html',
        controller: UserController
    });
})
.run(function($rootScope, $restful, Gem, $location){
	$restful.$baseURL = 'http://angular-restful-6072.sae1.actionbox.io:3000';
	$rootScope.gem = Gem.get();
});