'use strict';

/* Controllers */

let exampleControllers = angular.module('exampleControllers', []);

exampleControllers.controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.dzOptions = {
            url: '/upload',
            paramName: 'file',
            maxFilesize: '10',
            acceptedFiles: '.xls',
            addRemoveLinks: true
        };

        $scope.uploadedFile = {};

        $scope.fileSuccess = false;


        //Handle events for dropzone
        //Visit http://www.dropzonejs.com/#events for more events
        $scope.dzCallbacks = {
            'addedfile': function (file) {
                console.log(file);
                $scope.newFile = file;
            },
            'success': function (file, xhr) {
                $scope.fileSuccess = true;
                $scope.uploadedFile = JSON.parse(angular.toJson(xhr));
                console.log(JSON.stringify(xhr));
            }
        };

        $scope.semantifyIt = function() {
            $http.post('/semantifyIt', $scope.uploadedFile.output).then( succ => {
                alert('upload worked');
            }, err => {
                alert('something went wrong');
            });
        };


        //Apply methods for dropzone
        //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
        $scope.dzMethods = {};
        $scope.removeNewFile = function () {
            $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
        }
    }]);