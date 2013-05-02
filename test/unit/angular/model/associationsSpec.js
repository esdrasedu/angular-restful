'use strict';
describe("associations-restful", function() {

    var $restful, callback, $httpBackend;

    beforeEach(module('restful'));

    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $restful = $injector.get('$restful');
        callback = jasmine.createSpy();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should create routes', function() {
        $httpBackend.when('GET', '/Path').respond([{id:1}, {id:2}]);
        $httpBackend.when('GET', '/Path/1').respond({id:1});
        $httpBackend.when('GET', '/Path/2').respond({id:2});
        var Parent = $restful('/Path/:id');

        var paths = Parent.query(function(){
            for( var i = 0; i < paths.length; i++){
                var path = paths[i];
                expect(path.$getUrl()).toEqualData('/Path/'+path.id);
            }
        });

        var path1 = new Parent({id:1});
        expect(path1.$getUrl()).toEqualData('/Path/1');

        var path2 = Parent.get({id:2}, function(){
            expect(path2.$getUrl()).toEqualData('/Path/2');
        });

    });

    it('should create route association without params', function() {
        var Parent = $restful('/Parent');
        var Child = $restful('/Child');

        $httpBackend.when('GET', '/Parent').respond('{}');
        $httpBackend.when('GET', '/Child').respond('{}');
        $httpBackend.when('GET', '/Parent/Child').respond('{}');

        var parent = Parent.get();
        Child.get(function(){
          Child.get([parent]);
        });
    });
		
  	it('should create route association without params', function() {
      var Parent = $restful('/Parent/:key');
      var Child = $restful('/Child');

      $httpBackend.when('GET', '/Parent/test').respond({id:1, key:test});
      $httpBackend.when('GET', '/Parent/1/Child').respond('{}');

      var parent = Parent.get({key:'test'});
      Child.get(function(){
      	Child.get([parent]);
      });
    });
  
  	it('should create route association with two params', function() {
      var Parent = $restful('/Parent/:a/:b');
      var Child = $restful('/Child');

      $httpBackend.when('GET', '/Parent/teste1/teste2/Child').respond('{}');

      var parent = Parent.get({a:'test1', b:'test2'});
      Child.get([parent]);
    });
  
    it('should respect the order of restful', function() {
      var GrandParent = $restful('/GrandParent/');
      var Parent = $restful('/Parent/');
      var Child = $restful('/Child');

      $httpBackend.when('GET', '/GrandParent/Parent/Child').respond('{}');
      $httpBackend.when('GET', '/Child/Parent/GrandParent').respond('{}');

      var grand_parent = new GrandParent();
      var parent = new Parent();
      var child = new Child();
      
      Child.get([grand_parent, parent]);
      GrandParent.get([parent, child]);
    });
  	
    it('should create route association in others methods', function() {
      var Parent = $restful('/Parent/:id');
      var Child = $restful('/Child/:id');

      $httpBackend.when('POST', '/Parent/1/Child', '{"name":"John"}').respond({id:1, name:'John'});
      $httpBackend.when('PUT', '/Parent/1/Child/1', '{"name":"Paul"}').respond({id:1, name:'Paul'});
      $httpBackend.when('DELETE', '/Parent/1/Child/1').respond('{}');
			
      var parent = new Parent({id:1});
      var child = Child.create([parent], function(){
        child.$update({name:'John'}, function(){
        	child.$destroy();
        });
      });
    });
  
    it('should create no route association in others methods passing restful empty', function() {
    	var Parent = $restful('/Parent/:id');
    	var Child = $restful('/Child/:id');
    
      $httpBackend.when('POST', '/Parent/1/Child', '{"name":"John"}').respond({id:1, name:'John'});
      $httpBackend.when('PUT', 'Child/1', '{"name":"Paul"}').respond({id:1, name:'Paul'});
      $httpBackend.when('DELETE', 'Child/1').respond('{}');
      
      var parent = new Parent({id:1});
      var child = Child.create([parent], function(){
        child.$update([], {name:'John'}, function(){
          child.$destroy();
        });
      });
    });
  
});