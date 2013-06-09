angular.module('angular-restful.service', ['restful'])
.factory('GitHub', ['$restful', function($restful) {
	return $restful('/esdrasedu/angular-restful/:action', {
        baseURL: 'https://api.github.com/repos',
        actions: {
            tags: {method: "GET", params:{action: 'tags'}, isArray:true}
        }
    });
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