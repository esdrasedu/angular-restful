describe("railsResourceFactory", function () {
    'use strict';

    beforeEach(module('rails'));

    describe('singular', function() {
        var $httpBackend, $rootScope, factory, Test,
            config = {
                url: '/test',
                name: 'test'
            };

        beforeEach(inject(function (_$httpBackend_, _$rootScope_, railsResourceFactory) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            factory = railsResourceFactory;
            Test = railsResourceFactory(config);
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('query should return resource object when response is single object', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(200, {test: {abc: 'xyz'}});

            expect(promise = Test.query()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({abc: 'xyz'});
        }));

        it('query should return no data on 204', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test').respond(204);
            expect(promise = Test.query()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeUndefined();
        }));

        it('query should add parameter abc=1', inject(function($httpBackend) {
            var promise;

            $httpBackend.expectGET('/test?abc=1').respond(200, {test: {abc: 'xyz'}});

            expect(promise = Test.query({abc: '1'})).toBeDefined();
            $httpBackend.flush();
        }));

        it('query should add parameters abc=1 & xyz=2', inject(function($httpBackend) {
            var promise;

            $httpBackend.expectGET('/test?abc=1&xyz=2').respond(200, {test: {abc: 'xyz'}});

            expect(promise = Test.query({abc: '1', xyz: 2})).toBeDefined();
            $httpBackend.flush();
        }));

        it('query with default params should add parameter abc=1', inject(function($httpBackend) {
            var promise, resource, defaultParamsConfig = {};

            $httpBackend.expectGET('/test?abc=1').respond(200, {test: {abc: 'xyz'}});

            angular.copy(config, defaultParamsConfig);
            defaultParamsConfig.defaultParams = {abc: '1'};

            resource = factory(defaultParamsConfig);
            expect(promise = resource.query()).toBeDefined();

            $httpBackend.flush();
        }));

        it('get should return resource object when response is 200', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test/123').respond(200, {test: {id: 123, abc: 'xyz'}});

            expect(promise = Test.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({id: 123, abc: 'xyz'});
        }));

        it('get should work with id as string as well', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test/123').respond(200, {test: {id: 123, abc: 'xyz'}});

            expect(promise = Test.get('123')).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({id: 123, abc: 'xyz'});
        }));

        it('get should call failure callback when 404', inject(function($httpBackend) {
            var promise, success = false, failure = false;

            $httpBackend.expectGET('/test/123').respond(404);

            expect(promise = Test.get(123)).toBeDefined();

            promise.then(function () {
                success = true;
            }, function () {
                failure = true;
            });

            $httpBackend.flush();

            expect(success).toBe(false);
            expect(failure).toBe(true);
        }));

        it('get with default params should add parameter abc=1', inject(function($httpBackend) {
            var promise, resource, defaultParamsConfig = {};

            $httpBackend.expectGET('/test/123?abc=1').respond(200, {test: {abc: 'xyz'}});

            angular.copy(config, defaultParamsConfig);
            defaultParamsConfig.defaultParams = {abc: '1'};

            resource = factory(defaultParamsConfig);
            expect(promise = resource.get(123)).toBeDefined();

            $httpBackend.flush();
        }));

        it('should be able to turn off root mapping and field renaming', inject(function($httpBackend) {
            var promise, result, resource;

            $httpBackend.expectGET('/test/123').respond(200, {id: 123, abc_def: 'xyz'});

            resource = factory(config);
            resource.responseInterceptors = [];
            resource.requestTransformers = [];
            expect(promise = resource.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(resource);
            expect(result).toEqualData({id: 123, abc_def: 'xyz'});
        }));

        it('should be able to turn off root mapping but keep field renaming', inject(function($httpBackend) {
            var promise, result, resource, testConfig = {};

            $httpBackend.expectGET('/test/123').respond(200, {id: 123, abc_def: 'xyz'});

            angular.copy(config, testConfig);
            testConfig.requestTransformers = [];
            testConfig.responseInterceptors = ['railsFieldRenamingInterceptor'];
            resource = factory(testConfig);

            expect(promise = resource.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(resource);
            expect(result).toEqualData({id: 123, abcDef: 'xyz'});
        }));

        it('should be able to create new instance and save it', inject(function($httpBackend) {
            var data = new Test({abcDef: 'xyz'});

            $httpBackend.expectPOST('/test', {test: {abc_def: 'xyz'}}).respond(200, {test: {id: 123, abc_def: 'xyz'}});
            data.create();
            $httpBackend.flush();

            expect(data).toEqualData({id: 123, abcDef: 'xyz'});
        }));

        it('should be able to create new instance and update it', inject(function($httpBackend) {
            var data = new Test({abcDef: 'xyz'});

            $httpBackend.expectPOST('/test', {test: {abc_def: 'xyz'}}).respond(200, {test: {id: 123, abc_def: 'xyz'}});
            data.create();
            $httpBackend.flush(1);

            expect(data).toEqualData({id: 123, abcDef: 'xyz'});

            $httpBackend.expectPUT('/test/123', {test: {id: 123, xyz: 'abc', abc_def: 'xyz'}}).respond(200, {test: {id: 123, abc_def: 'xyz', xyz: 'abc', extra: 'test'}});
            data.xyz = 'abc';
            data.update();
            $httpBackend.flush();

            expect(data).toEqualData({id: 123, abcDef: 'xyz', xyz: 'abc', extra: 'test'});
        }));

        it('create with default params should add parameter abc=1', inject(function($httpBackend) {
            var promise, Resource, data, defaultParamsConfig = {};

            $httpBackend.expectPOST('/test?abc=1', {test: {}}).respond(200, {test: {abc: 'xyz'}});

            angular.copy(config, defaultParamsConfig);
            defaultParamsConfig.defaultParams = {abc: '1'};

            Resource = factory(defaultParamsConfig);
            data = new Resource();
            data.create();

            $httpBackend.flush();
        }));

        it('should be able to get resource and update it', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test/123').respond(200, {test: {id: 123, abc: 'xyz', xyz: 'abcd'}});

            expect(promise = Test.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({id: 123, abc: 'xyz', xyz: 'abcd'});

            $httpBackend.expectPUT('/test/123', {test: {id: 123, abc: 'xyz', xyz: 'abc'}}).respond(200, {test: {id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'}});
            result.xyz = 'abc';
            result.update();
            $httpBackend.flush();

            // abc was originally set on the object so it should still be there after the update
            expect(result).toEqualData({id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'});
        }));

        it('update should handle 204 response', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test/123').respond(200, {test: {id: 123, abc: 'xyz'}});

            expect(promise = Test.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({id: 123, abc: 'xyz'});

            $httpBackend.expectPUT('/test/123', {test: {id: 123, abc: 'xyz', xyz: 'abc'}}).respond(204);
            result.xyz = 'abc';
            result.update();
            $httpBackend.flush();

            expect(result).toEqualData({id: 123, abc: 'xyz', xyz: 'abc'});
        }));

        it('should be able to delete instance returned from get', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/test/123').respond(200, {test: {id: 123, abc: 'xyz'}});

            expect(promise = Test.get(123)).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(result).toBeInstanceOf(Test);
            expect(result).toEqualData({id: 123, abc: 'xyz'});

            $httpBackend.expectDELETE('/test/123').respond(204);
            result.remove();
            $httpBackend.flush();
        }));

        it('delete with default params should add parameter abc=1', inject(function($httpBackend) {
            var promise, Resource, data, defaultParamsConfig = {};

            $httpBackend.expectDELETE('/test/123?abc=1').respond(204);

            angular.copy(config, defaultParamsConfig);
            defaultParamsConfig.defaultParams = {abc: '1'};

            Resource = factory(defaultParamsConfig);
            data = new Resource();
            data.id = 123;
            data.remove();

            $httpBackend.flush();
        }));

        it('should transform attributes on build', function() {
            var test = new Test({id: 123, abc_def: "T"});
            expect(test).toEqualData({id: 123, abcDef: "T"});
        });

        angular.forEach(['post', 'put', 'patch'], function (method) {
            it('should be able to ' + method + ' to arbitrary url', inject(function($httpBackend) {
                var promise, result = {};

                promise = Test['$' + method]('/xyz', {id: 123, abc: 'xyz', xyz: 'abc'});
                $httpBackend['expect' + angular.uppercase(method)]('/xyz', {test: {id: 123, abc: 'xyz', xyz: 'abc'}}).respond(200, {test: {id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'}});

                promise.then(function (response) {
                    result = response;
                });

                $httpBackend.flush();

                // abc was originally set on the object so it should still be there after the update
                expect(result).toEqualData({id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'});
            }));

            it('should be able to ' + method + ' instance to arbitrary url', inject(function($httpBackend) {
                var test = new Test({id: 123, abc: 'xyz', xyz: 'abc'});
                $httpBackend['expect' + angular.uppercase(method)]('/xyz', {test: {id: 123, abc: 'xyz', xyz: 'abc'}}).respond(200, {test: {id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'}});
                test['$' + method]('/xyz');
                $httpBackend.flush();

                // abc was originally set on the object so it should still be there after the update
                expect(test).toEqualData({id: 123, abc: 'xyz', xyz: 'abc', extra: 'test'});
            }));
        });

    });

    describe('plural', function() {
        var $httpBackend, $rootScope, factory, PluralTest,
            pluralConfig = {
                url: '/pluralTest',
                name: 'singular',
                pluralName: 'plural'
            };

        beforeEach(inject(function (_$httpBackend_, _$rootScope_, railsResourceFactory) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            factory = railsResourceFactory;
            PluralTest = railsResourceFactory(pluralConfig);
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('query should return array of resource objects when result is an array', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/pluralTest').respond(200, {plural: [{abc: 'xyz'}, {xyz: 'abc'}]});

            expect(promise = PluralTest.query()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(angular.isArray(result)).toBe(true);
            angular.forEach(result, function (value) {
                expect(value).toBeInstanceOf(PluralTest);
            });
            expect(result[0]).toEqualData({abc: 'xyz'});
            expect(result[1]).toEqualData({xyz: 'abc'});

        }));

        it('query should return empty array when result is empty array', inject(function($httpBackend) {
            var promise, result;

            $httpBackend.expectGET('/pluralTest').respond(200, {plural: []});

            expect(promise = PluralTest.query()).toBeDefined();

            promise.then(function (response) {
                result = response;
            });

            $httpBackend.flush();

            expect(angular.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        }));
    });
});