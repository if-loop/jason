'use strict';

/* Services */

var exampleServices = angular.module('exampleServices', ['ngResource']);

exampleServices.factory('Item', ['$resource',
  function($resource){
    return $resource('items/:phoneId.json', {}, {
      query: {method:'GET', params:{itemId:'items'}, isArray:true}
    });
  }]);