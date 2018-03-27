const uiModules = require('ui/modules');

import uiRoutes from 'ui/routes';
import  _ from "lodash";
import 'ui/autoload/styles';
import template from './templates/index.html';

uiRoutes.enable();
uiRoutes
    .when('/', {
        template: template,
        controller: 'createIndexPattern',
        controllerAs: 'ctrl'
    })

uiModules
    .get('app/indexpatterncreator', [])
    .controller('createIndexPattern', function ($scope, $location, $route, $interval, $http) {
        $scope.title = 'Patternizer';
        $scope.finishLoad = false;
        $scope.description = 'Patternizer';
        $scope.icon = "";

        $scope.location = $location;
        $scope.$watch('location.search()', function() {
            $scope.target = ($location.search()).target;
        }, true);

        $scope.changeTarget = function(name) {
            $location.search('target', name);
        }

        $scope.init = function () {
          //alert("hi2")
          var baseurl = $location.$$absUrl.split('/app')[0]
          $scope.target = ($location.search()).target;
          if(typeof $scope.target === 'undefined') {
            $scope.welcomemessage = 'Welcome to Index Pattern Creator'
            $scope.link = 'click here to create a new index pattern'
            //window.location.href=baseurl + "/app/kibana#/management"
          }else{
           var request = {'timeFieldName': '@timestamp', 'title': $scope.target};
           $http.post('../api/getIndexPattern', request).then((response, error) => {
             $scope.found = response.data.found;
             $scope.indextarget = 'Index pattern ' + $scope.target
             $scope.link = 'click here'
             if($scope.found){
               $scope.message = 'already exists'
               $scope.createmessage = 'to view'
             }else{
               $scope.message = 'does not exist'
               $scope.createmessage = 'to create one'
             }
          });
         }
      }

      $scope.createPattern = function () {
        var baseurl = $location.$$absUrl.split('/app')[0]
        var request = {'timeFieldName': '@timestamp', 'title': $scope.target};
        if(typeof $scope.target === 'undefined') {
          window.location.href=baseurl + "/app/kibana#/management/kibana/indices"
        } else {
          if($scope.found){
            $http.post('../api/getShortUrl', request).then((response) => {
              $scope.urlfound = response.data.found;
              if($scope.urlfound){
                window.location.href=baseurl + "/goto/shorturl" + $scope.target
              }
              if(typeof $scope.urlfound === 'undefined'){
                $http.post('../api/createShortUrl', request).then((response) => {
                  window.location.href=baseurl + "/goto/shorturl" + $scope.target
                });
              }
            });
          }else{
            $http.post('../api/createIndexPattern', request).then((response) => {
              $http.post('../api/getShortUrl', request).then((response) => {
                $scope.urlfound = response.data.found;
                if($scope.urlfound){
                  window.location.href=baseurl + "/goto/shorturl" + $scope.target
                }
                if(typeof $scope.urlfound === 'undefined'){
                  $http.post('../api/createShortUrl', request).then((response) => {
                    window.location.href=baseurl + "/goto/shorturl" + $scope.target
                  });
                }
              });
            });
          }
        }
      }
});
