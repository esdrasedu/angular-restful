angular.module('model', ['ng']).
factory('$restful', ['$resource', function($resource) {

    function ResfullFctory( url, opts ) {
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
    };

    return ResfullFctory;
});