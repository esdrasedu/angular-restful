angular.module('restful', ['ngResource']).
factory('$restful', ['$resource', function($resource) {

    function RestfulFactory( url, opts ) {

        var defaultActions = {
            'get':      {method:'GET'},
            'query':    {method:'GET', isArray:true},
            'create':   {method:'POST'},
            'update':   {method:'PUT'},
            'destroy':  {method:'DELETE'}
        };

        var optDefault = {
            params:     {},
            actions:    {},
            only:       [],
            except:     []
        };

        opts = angular.extend({}, optDefault, opts);
        opts['actions'] = angular.extend({}, defaultActions, opts['actions']);

        return $resource(url, opts['params'], opts['actions']);
    };

    return $resource;
}]);