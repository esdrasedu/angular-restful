angular.module('angular-restful.service', ['restful'])
.factory('Gem', ['$restful', function($restful) {
	return $restful('/gem');
}])
.factory('User', ['$restful', function($restful) {
	return $restful('/users/:id', {params:{id:'@id'}});
}])
.factory('Post', ['$restful', function($restful) {
	return $restful('/posts/:id', {params:{id:'@id'}});
}])
.factory('Category', ['$restful', function($restful) {
	return $restful('/categories/:id', {params:{id:'@id'}});
}]);