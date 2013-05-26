function UserController($scope, User){
    $scope.users = User.query();
    $scope.user = null;
    $scope.create = function(){
        $scope.user = new User();
    };
    $scope.edit = function( $user ){
        $scope.user = $user;
    };
    $scope.save = function(){
        $scope.user.$update(function(){
            if( !$scope.users.indexOf($scope.user) ){
                $scope.users.unshift($scope.user);
            }
        });
    };
    $scope.remove = function( $user ){
        $user.$destroy(function(){
            $scope.users.splice($scope.users.indexOf($user), 1);
        });
    };
    $scope.cancel = function(){
        $scope.user = null;
    };
}