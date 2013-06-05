angular.module('angular-restful', ['angular-restful.service'])
.config(function($httpProvider, $routeProvider, $locationProvider, $anchorScrollProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode(false).hashPrefix('');
    $anchorScrollProvider.disableAutoScrolling();

    var views = './views';
    $routeProvider.when('/', {
        templateUrl: views+'/user/list.html',
        controller: UserController
    }).when('/users', {
        templateUrl: views+'/user/list.html',
        controller: UserController
    }).when('/users/:id_user/posts', {
        templateUrl: views+'/post/list.html',
        controller: PostController
    });
})
.run(function($rootScope, $restful, $location, $route, Gem, $anchorScroll){
    $rootScope.breadcrumb = [];
    $rootScope.defaultRoutes = $route.routes.current;
    $rootScope.$on('$locationChangeSuccess', function(event, current, previous){
        if( !$route.current ) {
            $route.current = $rootScope.defaultRoutes;
        } else {
            $rootScope.defaultRoutes = $route.current;
        }
    });

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        if( current ){
            $rootScope.breadcrumb = $location.path().split('/').splice(1);
        }
        if( $location.path() != '/'){
            $location.hash('users');
            $anchorScroll();
        } else {
            $rootScope.breadcrumb = ['users'];
        }
    });

    $rootScope.changePath = function( indice ){
        $location.path($location.path().split('/').splice(1, (indice+1)).join('/')).replace();
    };

    $restful.$baseURL = 'http://angular-restful-6072.sae1.actionbox.io:3000';
    $rootScope.gem = Gem.get();
});