function UserController($rootScope, $scope, User){
    $scope.users = User.query();
    $scope.user = null;
    $scope.create = function(){
        $scope.user = new User();
    };
    $scope.cancel = function(){
        $scope.user = null;
    };
    $scope.edit = function( $user ){
        $scope.user = $user;
    };
    $scope.save = function(){
        if( angular.isDefined($scope.user.id) ) {
            $scope.user.$update(function(){
                $scope.user = null;
            });
        } else {
            $scope.user.$create(function( $user ){
                $scope.users.unshift($user);
                $scope.user = null;
            });
        }
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