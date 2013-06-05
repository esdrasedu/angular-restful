function PostController($rootScope, $routeParams, $scope, User, Post, Category){
    var id_user = $routeParams.id_user;
    var path = 'users/'+id_user+'/posts';
    var user_current = new User({id: id_user});
    $scope.posts = Post.query([user_current]);
    $scope.categories = Category.query();
    $scope.post = null;
    $scope.create = function(){
        $scope.post = new Post();
    };
    $scope.cancel = function(){
        $scope.post = null;
    };
    $scope.edit = function( $post ){
        $scope.post = $post;
    };
    $scope.save = function(){
        if( angular.isDefined($scope.post.id) ) {
            $scope.post.$update(function(){
                $scope.post = null;
            });
        } else {
            $scope.post.$create([user_current], function( $post ){
                $scope.posts.unshift($post);
                $scope.post = null;
            });
        }
    };
    $scope.remove = function( $post ){
        $post.$destroy(function(){
            $scope.posts.splice($scope.posts.indexOf($post), 1);
        });
    };
    $scope.cancel = function(){
        $scope.post = null;
    };
}