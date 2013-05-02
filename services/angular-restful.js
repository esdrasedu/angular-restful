angular.module('angular-restful.service', ['restful'])
.factory('Gem', ['$restful', function($restful) {
	return $restful('/gem');
}])
.factory('User', ['$restful', function($restful) {
	return $restful('/users/:id');
}])
.factory('Post', ['$restful', function($restful) {
	return $restful('/posts/:id');
}])
.factory('Tag', ['$restful', function($restful) {
	return $restful('/tags/:id');
}])
.factory('Category', ['$restful', function($restful) {
	return $restful('/categories/:id');
}]);