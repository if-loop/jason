'use strict';


Dropzone.autoDiscover = false;

/* App Module */
let exampleApp = angular.module('exampleApp', [
    'ngRoute',
    'exampleControllers',
    'exampleFilters',
    'exampleServices',
    'thatisuday.dropzone',
    'jsonFormatter',
    'tableSort',
    'ngclipboard'
]);

exampleApp.directive('myRefresh',function($location,$route){
    return function(scope, element, attrs) {
        element.bind('click',function(){
            if(element[0] && element[0].href && element[0].href === $location.absUrl()){
                $route.reload();
            }
        });
    }
});

exampleApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.when('/upload', {
            templateUrl: 'partials/upload-screen.html',
            controller: 'UploadCtrl'
        }).otherwise({
            redirectTo: '/upload'
        });
    }]);